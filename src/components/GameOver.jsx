import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function GameOver({ score, round, onRestart, onLeaderboard, onHome, onSaveScore, savedUsername, userExistsInSupabase }) {
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [username, setUsername] = useState(savedUsername || "");
  const [saving, setSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const userHasUsername = savedUsername && savedUsername.trim() !== "";

  useEffect(() => {
    if (userHasUsername && score > 0 && !autoSaved) {
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
    <div className="w-full min-h-screen bg-memphis-main px-3 py-2 md:p-8 flex flex-col items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-2 sm:gap-3 md:gap-6 w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="w-full">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-center leading-tight nb-card p-2 sm:p-3 md:p-6"
              style={{ textShadow: '3px 3px 0 #000', color: '#FF6AD5' }}>
            GAME OVER
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="nb-card p-3 sm:p-4 md:p-6 text-center w-full"
        >
          <p className="text-black font-bold text-sm md:text-lg mb-0.5">FINAL SCORE</p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            className="text-[#FF6AD5] font-black text-4xl sm:text-5xl md:text-7xl leading-none break-all"
          >
            {score}
          </motion.p>
          <div className="mt-2 pt-2 border-t-2 md:border-t-4 border-black flex justify-center gap-6">
            <div>
              <p className="text-black font-bold text-xs md:text-base">ROUNDS</p>
              <p className="text-black font-black text-2xl md:text-3xl">{round - 1}</p>
            </div>
          </div>
        </motion.div>

        {!userHasUsername && showSavePrompt && (
          <motion.div variants={itemVariants} className="nb-card p-3 md:p-5 w-full">
            <p className="text-black font-black text-sm md:text-lg mb-2 text-center">SAVE YOUR SCORE</p>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                maxLength={20}
                className="w-full p-2 border-3 border-black font-black text-sm md:text-base"
              />
              <motion.button
                onClick={handleSave}
                disabled={!username.trim() || saving}
                whileHover={username.trim() ? { scale: 1.04, rotate: 2 } : {}}
                whileTap={username.trim() ? { scale: 0.96 } : {}}
                className={`nb-btn text-black font-black text-sm md:text-base py-2 px-6 cursor-pointer text-center ${!username.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: '#FFF44F' }}
              >
                {saving ? "SAVING..." : "SAVE SCORE"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {autoSaved && (
          <motion.div variants={itemVariants} className="nb-card p-2 md:p-3 w-full">
            <p className="text-black font-black text-sm md:text-lg text-center text-green-600">SCORE SAVED!</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col gap-2 md:gap-3 w-full">
          <motion.button
            onClick={onLeaderboard}
            whileHover={{ scale: 1.04, rotate: -2 }}
            whileTap={{ scale: 0.96 }}
            className="nb-btn text-black font-black text-sm md:text-xl py-2.5 md:py-4 px-6 md:px-8 cursor-pointer text-center"
            style={{ backgroundColor: '#98FB98' }}
          >
            LEADERBOARD
          </motion.button>
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.04, rotate: -2 }}
            whileTap={{ scale: 0.96 }}
            className="nb-btn text-black font-black text-sm md:text-xl py-2.5 md:py-4 px-6 md:px-8 cursor-pointer text-center"
            style={{ backgroundColor: '#72EFDD' }}
          >
            PLAY AGAIN
          </motion.button>
          <motion.button
            onClick={onHome}
            whileHover={{ scale: 1.04, rotate: 2 }}
            whileTap={{ scale: 0.96 }}
            className="nb-btn text-black font-black text-sm md:text-xl py-2.5 md:py-4 px-6 md:px-8 cursor-pointer text-center"
            style={{ backgroundColor: '#C77DFF' }}
          >
            MAIN MENU
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}