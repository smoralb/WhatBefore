import { motion } from "framer-motion";

export default function GameOver({ score, round, onRestart, onLeaderboard, onHome }) {
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

  const bounceVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-8 min-h-screen py-12 px-4"
    >
      <motion.div
        variants={bounceVariants}
        className="w-24 h-24 bg-[#FFF44F] border-4 border-black absolute"
        style={{ top: '8%', left: '10%', borderRadius: '50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        variants={bounceVariants}
        className="w-20 h-20 bg-[#FF6AD5] border-4 border-black absolute"
        style={{ top: '12%', right: '12%' }}
        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

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

      <motion.div variants={itemVariants} className="flex flex-col gap-4 w-full max-w-sm">
        <motion.button
          onClick={onLeaderboard}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          className="nb-btn text-black font-black text-xl py-5 px-8 cursor-pointer text-center"
          style={{ backgroundColor: '#FFF44F' }}
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
  );
}