import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ensurePreloaded } from "../utils/wikiApi";

const MemphisShape = ({ type, color, top, left, delay, rotate, duration }) => {
  const variants = {
    animate: {
      y: [0, -30, 0],
      rotate: [rotate, rotate + 15, rotate],
      transition: {
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      animate="animate"
      className={`absolute z-10 pointer-events-none ${type}`}
      style={{ top, left, backgroundColor: color }}
    />
  );
};

export default function Home({ onStart, onLeaderboard }) {
  useEffect(() => {
    ensurePreloaded(3);
  }, []);

  // hideOnMobile: true → solo se renderiza en md+ para evitar saturar el viewport pequeño.
  const shapes = useMemo(() => [
    { type: "nb-zigzag", top: "8%", left: "4%", rotate: 15, delay: 0, hideOnMobile: false },
    { type: "nb-squiggle", top: "18%", left: "85%", rotate: -10, delay: 0.5, hideOnMobile: false },
    { type: "nb-triangle", top: "72%", left: "8%", rotate: 45, delay: 1, color: "transparent", hideOnMobile: false },
    { type: "w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-black bg-nb-pink", top: "12%", left: "70%", rotate: 0, delay: 1.5, hideOnMobile: false },
    { type: "w-14 h-14 md:w-16 md:h-16 border-4 border-black bg-nb-purple rotate-12", top: "82%", left: "78%", rotate: 12, delay: 2, hideOnMobile: false },
    { type: "nb-zigzag", top: "62%", left: "82%", rotate: -20, delay: 2.5, hideOnMobile: false },
    { type: "nb-squiggle", top: "86%", left: "18%", rotate: 5, delay: 3, hideOnMobile: false },

    // Estas se ocultan en mobile para no saturar la pantalla pequeña.
    { type: "w-8 h-28 border-4 border-black bg-nb-yellow rotate-45", top: "5%", left: "72%", rotate: 45, delay: 0.2, hideOnMobile: true },
    { type: "w-20 h-20 rounded-full border-4 border-black bg-nb-teal", top: "45%", left: "4%", rotate: 0, delay: 0.8, hideOnMobile: true },
    { type: "nb-triangle", top: "10%", left: "25%", rotate: -15, delay: 1.2, color: "transparent", hideOnMobile: true },
    { type: "nb-zigzag", top: "40%", left: "92%", rotate: 90, delay: 1.8, hideOnMobile: true },
    { type: "w-14 h-14 border-4 border-black bg-nb-pink -rotate-12", top: "75%", left: "44%", rotate: -12, delay: 2.2, hideOnMobile: true },
    { type: "nb-squiggle", top: "50%", left: "12%", rotate: 45, delay: 0.4, hideOnMobile: true },
    { type: "w-10 h-10 rounded-full border-4 border-black bg-white", top: "28%", left: "30%", rotate: 0, delay: 1.1, hideOnMobile: true },
    { type: "w-6 h-24 border-4 border-black bg-nb-purple rotate-90", top: "90%", left: "60%", rotate: 90, delay: 2.8, hideOnMobile: true },
    { type: "w-16 h-4 border-4 border-black bg-nb-yellow", top: "55%", left: "36%", rotate: 0, delay: 0.6, hideOnMobile: true },
    { type: "w-12 h-12 border-4 border-black bg-nb-teal rotate-45", top: "5%", left: "88%", rotate: 45, delay: 1.4, hideOnMobile: true },
  ].map((s, i) => ({ ...s, duration: 5 + ((i * 0.37) % 3), key: i })), []);

  return (
    <div className="w-full min-h-screen bg-memphis-main flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">

      {/* Scattered shapes */}
      {shapes.map((shape) => (
        <div key={shape.key} className={shape.hideOnMobile ? "hidden md:block" : ""}>
          <MemphisShape {...shape} />
        </div>
      ))}

      {/* Big Comic Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
        className="relative mb-6 sm:mb-8 md:mb-12 z-20 px-2"
      >
        <h1
          className="font-bangers text-5xl sm:text-7xl md:text-9xl text-center tracking-wider leading-none"
          style={{
            textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
            fontFamily: 'Bangers, cursive'
          }}
        >
          <span className="text-nb-pink">What</span>
          <br />
          <span className="text-nb-purple">Before!</span>
        </h1>
      </motion.div>

      {/* Action Area */}
      <div className="relative z-20 flex flex-col items-center gap-5 sm:gap-6 md:gap-8 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white border-3 md:border-4 border-black px-4 py-2 md:p-4 rotate-2"
        >
          <p className="font-black text-sm sm:text-base md:text-xl tracking-tight uppercase text-center">
            ▼ Insert Coin to Start ▼
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="nb-btn text-2xl sm:text-3xl md:text-5xl py-3 px-6 md:py-5 md:px-10 relative overflow-hidden w-full"
        >
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(black 2px, transparent 2px), radial-gradient(black 2px, transparent 2px)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 8px 8px'
            }}
          />
          <span className="relative z-10 whitespace-nowrap">Jugar ahora</span>
        </motion.button>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLeaderboard}
          className="nb-btn text-xl sm:text-2xl md:text-3xl py-3 px-6 md:py-4 md:px-8 w-full"
          style={{ backgroundColor: '#98FB98' }}
        >
          Leaderboard
        </motion.button>
      </div>

      {/* Background Dots Grid decoration */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(black 2px, transparent 2px)', backgroundSize: '20px 20px' }}
      />
    </div>
  );
}
