import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Leaderboard({ onRestart, onHome, savedUsername }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
  const REQUEST_TIMEOUT = 8000;

  const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetchWithTimeout(
          `${SUPABASE_URL}/rest/v1/scores?select=*&order=score.desc&limit=50`,
          {
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": `Bearer ${SUPABASE_KEY}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching leaderboard:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const top3 = entries.slice(0, 3);
  const userIndex = entries.findIndex(e => e.username === savedUsername);
  const currentUser = userIndex !== -1 ? entries[userIndex] : null;
  
  const getNeighbors = () => {
    if (!currentUser || userIndex === -1) return [];
    const neighbors = [];
    if (userIndex > 0) neighbors.push(entries[userIndex - 1]);
    if (userIndex < entries.length - 1) neighbors.push(entries[userIndex + 1]);
    return neighbors;
  };
  const neighbors = getNeighbors();

  return (
    <div className="w-full min-h-screen bg-memphis-main p-4 md:p-8 flex flex-col items-center justify-center mobile-scroll">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="nb-card p-6 md:p-8 text-center w-full"
          style={{ backgroundColor: '#FF6AD5' }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-center text-white"
              style={{ textShadow: '4px 4px 0 #000' }}>
            LEADERBOARD
          </h2>
        </motion.div>

        <div className="w-full flex flex-col gap-2">
          {loading ? (
            <div className="nb-card p-6 text-center">
              <span className="text-black font-black text-xl">LOADING...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="nb-card p-6 text-center">
              <span className="text-black font-black text-xl">NO SCORES YET</span>
            </div>
          ) : (
            <>
              {top3.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className={`nb-card p-3 md:p-4 flex items-center justify-between gap-3 ${
                    index === 0 ? 'bg-[#FFD700]' : index === 1 ? 'bg-gray-300' : 'bg-orange-300'
                  }`}
                >
                  <span className="text-2xl md:text-3xl font-black">
                    {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                  </span>
                  <span className="text-black text-lg md:text-xl font-black truncate flex-1 text-center">
                    {entry.username}
                  </span>
                  <span className="text-black text-xl md:text-2xl font-black">
                    {entry.score}
                  </span>
                </motion.div>
              ))}

              {currentUser && entries.length > 3 && (
                <>
                  <div className="flex items-center gap-2 my-2">
                    <div className="flex-1 h-2 border-t-4 border-dashed border-black"></div>
                    <span className="text-black font-black text-sm">MORE</span>
                    <div className="flex-1 h-2 border-t-4 border-dashed border-black"></div>
                  </div>

                  {userIndex > 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="nb-card p-3 flex items-center justify-between gap-3 bg-gray-200"
                    >
                      <span className="text-black text-xl font-black">#{userIndex + 1}</span>
                      <span className="text-black font-black truncate flex-1 text-center">
                        {entries[userIndex - 1].username}
                      </span>
                      <span className="text-black font-black">{entries[userIndex - 1].score}</span>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    className="nb-card p-4 flex items-center justify-between gap-3"
                    style={{ backgroundColor: '#FFF44F' }}
                  >
                    <span className="text-black text-2xl font-black">#{userIndex + 1}</span>
                    <span className="text-black text-xl font-black truncate flex-1 text-center">
                      {currentUser.username}
                    </span>
                    <span className="text-black text-2xl font-black">{currentUser.score}</span>
                  </motion.div>

                  {neighbors.map(neighbor => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="nb-card p-3 flex items-center justify-between gap-3 bg-gray-100 opacity-70"
                    >
                      <span className="text-black text-xl font-black">
                        {entries.indexOf(neighbor) + 1}
                      </span>
                      <span className="text-black font-black truncate flex-1 text-center">
                        {neighbor.username}
                      </span>
                      <span className="text-black font-black">{neighbor.score}</span>
                    </motion.div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        <div className="flex gap-4 w-full mt-2">
          <motion.button
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="nb-btn text-black font-black text-lg py-4 px-6 flex-1"
            style={{ backgroundColor: '#72EFDD' }}
          >
            PLAY AGAIN
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="nb-btn text-black font-black text-lg py-4 px-6 flex-1"
            style={{ backgroundColor: '#C77DFF' }}
          >
            MAIN MENU
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}