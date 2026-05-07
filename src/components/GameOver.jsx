import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function GameOver({ score, round, onRestart, onLeaderboard, onHome, onSaveScore, savedUsername, userExistsInSupabase }) {
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [username, setUsername] = useState(savedUsername || "");
  const [saving, setSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const userHasUsername = savedUsername && savedUsername.trim() !== "";

  useEffect(() => {
    if (userHasUsername && userExistsInSupabase && score > 0 && !autoSaved) {
      setAutoSaved(true);
      onSaveScore(savedUsername, score, true);
    }
    if (!userHasUsername) {
      setShowSavePrompt(true);
    }
  }, [savedUsername, userExistsInSupabase, score]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const handleSave = async () => {
    if (!username.trim()) return;
    setSaving(true);
    await onSaveScore(username.trim(), score, true);
    setAutoSaved(true);
    setShowSavePrompt(false);
    setSaving(false);
  };

  return (
    <div className="w-full min-h-screen bg-memphis-main p-4 md:p-8 flex flex-col items-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-8 py-12 px-4"
      >
        <motion.div
          variants={itemVariants}
          className="nb-card p-8 w-full max-w-md"
        >
          <h2 className="text-4xl md:text-6xl font-black text-center"
              style={{ textShadow: '4px 4px 0 #000', color: '#FF6AD5' }}>
            GAME OVER
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="nb-card p-8 text-center w-full max-w-md"
        >
          <p className="text-black font-bold text-xl mb-2">FINAL SCORE</p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            className="text-[#FF6AD5] font-black text-6xl md:text-8xl"
          >
            {score}
          </motion.p>
          <div className="mt-4 pt-4 border-t-4 border-black">
            <p className="text-black font-bold text-lg">ROUNDS SURVIVED</p>
            <p className="text-black font-black text-4xl">{round - 1}</p>
          </div>
        </motion.div>

        {!userHasUsername && showSavePrompt && (
          <motion.div variants={itemVariants} className="nb-card p-6 w-full max-w-md">
            <p className="text-black font-black text-xl mb-4 text-center">SAVE YOUR SCORE</p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                maxLength={20}
                className="w-full p-3 border-4 border-black font-black text-lg"
              />
              <motion.button
                onClick={handleSave}
                disabled={!username.trim() || saving}
                whileHover={username.trim() ? { scale: 1.05, rotate: 2 } : {}}
                whileTap={username.trim() ? { scale: 0.95 } : {}}
                className={`nb-btn text-black font-black text-lg py-4 px-6 cursor-pointer text-center ${!username.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: '#FFF44F' }}
              >
                {saving ? "SAVING..." : "SAVE SCORE"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {autoSaved && (
          <motion.div variants={itemVariants} className="nb-card p-4 w-full max-w-md">
            <p className="text-black font-black text-xl text-center text-green-600">SCORE SAVED!</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col gap-4 w-full max-w-sm">
          <motion.button
            onClick={onLeaderboard}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="nb-btn text-black font-black text-xl py-5 px-8 cursor-pointer text-center"
            style={{ backgroundColor: '#98FB98' }}
          >
            LEADERBOARD
          </motion.button>
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="nb-btn text-black font-black text-xl py-5 px-8 cursor-pointer text-center"
            style={{ backgroundColor: '#72EFDD' }}
          >
            PLAY AGAIN
          </motion.button>
          <motion.button
            onClick={onHome}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="nb-btn text-black font-black text-xl py-5 px-8 cursor-pointer text-center"
            style={{ backgroundColor: '#C77DFF' }}
          >
            MAIN MENU
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}