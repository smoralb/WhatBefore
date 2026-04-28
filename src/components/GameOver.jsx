import { motion } from "framer-motion";

export default function GameOver({ score, round, onRestart, onLeaderboard, onHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8"
    >
      <div className="mem-shape-circle w-24 h-24 bg-[#FFD700] border-4 border-black absolute" style={{ top: '10%', left: '10%' }}></div>
      <div className="mem-shape-star w-20 h-20 bg-[#FF69B4] border-4 border-black absolute" style={{ top: '15%', right: '15%' }}></div>

      <motion.div
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        className="mem-card-coral brutal-border brutal-shadow p-8"
      >
        <h2 className="text-3xl md:text-5xl font-black text-white text-center mem-title">
          GAME OVER
        </h2>
      </motion.div>

      <div className="mem-display brutal-border brutal-shadow p-8 text-center">
        <p className="text-black font-bold text-xl mb-2">FINAL SCORE</p>
        <p className="text-[#FF69B4] font-black text-5xl md:text-7xl">{score}</p>
      </div>

      <div className="mem-card-yellow brutal-border brutal-shadow p-6 text-center">
        <p className="text-black font-bold text-lg">ROUNDS SURVIVED:</p>
        <p className="text-black font-black text-4xl">{round - 1}</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={onLeaderboard}
          className="mem-btn text-black font-black text-lg py-4 px-8 cursor-pointer"
        >
          LEADERBOARD
        </button>
        <button
          onClick={onRestart}
          className="mem-btn-mint font-black text-lg py-4 px-8 cursor-pointer hover:rotate-1 transition-transform"
        >
          PLAY AGAIN
        </button>
        <button
          onClick={onHome}
          className="mem-btn-sky font-black text-lg py-4 px-8 cursor-pointer hover:-rotate-1 transition-transform"
        >
          MAIN MENU
        </button>
      </div>
    </motion.div>
  );
}