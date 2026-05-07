import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Leaderboard({ onRestart, onHome }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/scores?select=*&order=score.desc&limit=20`,
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
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankClass = (index) => {
    if (index === 0) return "text-[#FFD700]";
    if (index === 1) return "text-gray-400";
    if (index === 2) return "text-orange-400";
    return "text-black";
  };

  const getRankIcon = (index) => {
    if (index === 0) return "👑";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 w-full max-w-md"
    >
      <div className="mem-shape-circle w-16 h-16 bg-[#98FB98] border-4 border-black absolute" style={{ top: '10%', left: '10%' }}></div>
      <div className="mem-shape-star w-12 h-12 bg-[#FFD700] border-4 border-black absolute" style={{ top: '15%', right: '15%' }}></div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mem-card-pink brutal-border brutal-shadow p-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-black text-white text-center">
          HIGH SCORES
        </h2>
      </motion.div>

      <div className="w-full mem-card brutal-border p-1">
        <div className="mem-card-pink brutal-border-b-0 p-2">
          <div className="bg-white brutal-border grid grid-cols-3 p-3 font-black text-sm md:text-base">
            <span className="text-black">RANK</span>
            <span className="text-black text-center">NAME</span>
            <span className="text-black text-right">SCORE</span>
          </div>
        </div>
        
        <div className="mem-card-coral p-1">
          {loading ? (
            <div className="bg-white border-4 border-black p-6 text-center">
              <span className="text-black font-bold">LOADING...</span>
            </div>
          ) : entries.length > 0 ? (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-4 border-black grid grid-cols-3 p-3 font-bold text-sm md:text-base"
              >
                <span className={`${getRankClass(index)} text-lg`}>
                  {getRankIcon(index)}
                </span>
                <span className="text-black text-center text-lg font-black truncate">{entry.username}</span>
                <span className="text-[#FF69B4] text-right text-lg font-black">{entry.score}</span>
              </motion.div>
            ))
          ) : (
            <div className="bg-white border-4 border-black p-6 text-center">
              <span className="text-black font-bold">NO SCORES YET</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={onRestart}
          className="mem-btn mem-btn-yellow text-black font-black text-lg py-4 px-8 cursor-pointer flex-1"
        >
          PLAY AGAIN
        </button>
        <button
          onClick={onHome}
          className="mem-btn mem-btn-sky font-black text-lg py-4 px-8 cursor-pointer flex-1"
        >
          MAIN MENU
        </button>
      </div>
    </motion.div>
  );
}