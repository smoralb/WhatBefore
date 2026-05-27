import { useEffect } from "react";
import { motion } from "framer-motion";
import { ensurePreloaded } from "../utils/wikiApi";

const MemphisShape = ({ type, color, top, left, delay, rotate, size = "" }) => {
  const variants = {
    animate: {
      y: [0, -30, 0],
      rotate: [rotate, rotate + 15, rotate],
      transition: {
        duration: 5 + Math.random() * 3,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      animate="animate"
      className={`absolute z-10 ${type} ${size}`}
      style={{ top, left, backgroundColor: color }}
    />
  );
};

export default function Home({ onStart, onLeaderboard }) {
  useEffect(() => {
    // Silently warm the Wikipedia preload queue while the user is on Home.
    // By the time they press "Jugar ahora", the first pair is usually ready.
    ensurePreloaded(3);
  }, []);

  const shapes = [
    // Formas originales
    { type: "nb-zigzag", top: "10%", left: "5%", rotate: 15, delay: 0 },
    { type: "nb-squiggle", top: "20%", left: "85%", rotate: -10, delay: 0.5 },
    { type: "nb-triangle", top: "70%", left: "10%", rotate: 45, delay: 1, color: "transparent" },
    { type: "w-12 h-12 rounded-full border-4 border-black bg-nb-pink", top: "15%", left: "40%", rotate: 0, delay: 1.5 },
    { type: "w-16 h-16 border-4 border-black bg-nb-purple rotate-12", top: "80%", left: "75%", rotate: 12, delay: 2 },
    { type: "nb-zigzag", top: "60%", left: "80%", rotate: -20, delay: 2.5 },
    { type: "nb-squiggle", top: "85%", left: "20%", rotate: 5, delay: 3 },
    
    // Nuevas formas añadidas
    { type: "w-8 h-32 border-4 border-black bg-nb-yellow rotate-45", top: "5%", left: "70%", rotate: 45, delay: 0.2 },
    { type: "w-20 h-20 rounded-full border-4 border-black bg-nb-teal", top: "45%", left: "5%", rotate: 0, delay: 0.8 },
    { type: "nb-triangle", top: "10%", left: "25%", rotate: -15, delay: 1.2, color: "transparent" },
    { type: "nb-zigzag", top: "40%", left: "90%", rotate: 90, delay: 1.8 },
    { type: "w-14 h-14 border-4 border-black bg-nb-pink -rotate-12", top: "75%", left: "45%", rotate: -12, delay: 2.2 },
    { type: "nb-squiggle", top: "50%", left: "15%", rotate: 45, delay: 0.4 },
    { type: "w-10 h-10 rounded-full border-4 border-black bg-white", top: "30%", left: "30%", rotate: 0, delay: 1.1 },
    { type: "w-6 h-24 border-4 border-black bg-nb-purple rotate-90", top: "90%", left: "60%", rotate: 90, delay: 2.8 },
    { type: "w-16 h-4 border-4 border-black bg-nb-yellow", top: "55%", left: "35%", rotate: 0, delay: 0.6 },
    { type: "w-12 h-12 border-4 border-black bg-nb-teal rotate-45", top: "5%", left: "90%", rotate: 45, delay: 1.4 }
  ];

  return (
    <div className="w-full min-h-screen bg-memphis-main flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Scattered Shapes */}
      {shapes.map((shape, i) => (
        <MemphisShape key={i} {...shape} />
      ))}

      {/* Big Comic Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
        className="relative mb-12 z-20"
      >
        <h1 className="font-bangers text-7xl md:text-9xl text-center tracking-wider" 
            style={{ 
              textShadow: '8px 8px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000',
              fontFamily: 'Bangers, cursive'
            }}>
          <span className="text-nb-pink">What</span>
          <br/>
          <span className="text-nb-purple">Before!</span>
        </h1>
      </motion.div>

      {/* Action Area */}
      <div className="relative z-20 flex flex-col items-center gap-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white border-4 border-black p-4 brutal-shadow-sm rotate-2"
        >
          <p className="font-black text-xl md:text-2xl tracking-tighter uppercase">
            ▼ Insert Coin to Start ▼
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStart}
          className="nb-btn text-3xl md:text-6xl relative overflow-hidden"
        >
          {/* Pointillism Pattern Layer */}
          <div className="absolute inset-0 opacity-25 pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(black 2px, transparent 2px), radial-gradient(black 2px, transparent 2px)', 
                 backgroundSize: '16px 16px',
                 backgroundPosition: '0 0, 8px 8px' 
               }} />
          <span className="relative z-10">Jugar ahora</span>
        </motion.button>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onLeaderboard}
          className="nb-btn text-2xl md:text-4xl"
          style={{ backgroundColor: '#98FB98' }}
        >
          Leaderboard
        </motion.button>
      </div>
      
      {/* Background Dots Grid decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(black 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
    </div>
  );
}
