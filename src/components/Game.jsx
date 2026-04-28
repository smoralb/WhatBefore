import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchEventPair, getEarlierEvent } from "../utils/wikiApi";

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23FFFFFF' width='400' height='300'/%3E%3Crect fill='none' stroke='%23000' stroke-width='4' x='10' y='10' width='380' height='280'/%3E%3Ctext fill='%23FF69B4' font-family='monospace' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENO IMAGE%3C/text%3E%3C/svg%3E";

const COLORS = ['mem-card-pink', 'mem-card-yellow', 'mem-card-mint', 'mem-card-coral', 'mem-card-sky'];

export default function Game({ onGameOver, onScore }) {
  const [events, setEvents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardColor, setCardColor] = useState(COLORS[0]);

  const loadNewPair = useCallback(async () => {
    setLoading(true);
    setSelected(null);
    setResult(null);
    setTimeLeft(15);
    setCardColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    
    try {
      const pair = await fetchEventPair();
      setEvents(pair);
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNewPair();
  }, [loadNewPair]);

  useEffect(() => {
    if (result !== null || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result, loading, events]);

  const handleAnswer = (selectedEvent) => {
    if (result !== null) return;

    const earlierEvent = getEarlierEvent(events[0], events[1]);
    const isCorrect = selectedEvent && selectedEvent.title === earlierEvent.title;

    setSelected(selectedEvent?.title || null);
    setResult(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      const points = 100 + (timeLeft * 10);
      setScore((prev) => prev + points);
      setTimeout(() => {
        onScore(score + points);
        loadNewPair();
      }, 1500);
    } else {
      setTimeout(() => {
        onGameOver(score);
      }, 1500);
    }
  };

  const progressPercent = (timeLeft / 15) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 memphes-bg">
      <div className="mem-shape-circle w-20 h-20 bg-[#FFD700] border-4 border-black absolute" style={{ top: '5%', left: '5%' }}></div>
      <div className="mem-shape-star w-16 h-16 bg-[#98FB98] border-4 border-black absolute" style={{ top: '5%', right: '10%' }}></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
      >
        <div className="mem-display brutal-border p-4">
          <span className="text-black font-black text-xl">ROUND</span>
        </div>

        <div className="flex-1 w-full md:w-auto">
          <div className="bg-white border-4 border-black">
            <div
              className="h-8 bg-gradient-to-r from-[#FF69B4] to-[#FFD700] transition-all duration-200 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mem-display brutal-border p-4">
          <span className={`font-black text-2xl ${timeLeft <= 5 ? "text-red-500" : "text-black"}`}>
            {timeLeft}s
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mem-display brutal-border p-4 mb-8"
      >
        <p className="text-black font-bold text-center text-xl md:text-2xl p-2">
          CLICK THE EVENT THAT HAPPENED <span className="text-[#FF69B4]">FIRST</span>
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center min-h-[300px]"
          >
            <div className="mem-card-pink brutal-border p-8 brutal-shadow text-center wiggle">
              <span className="text-black font-black text-2xl">LOADING...</span>
              <div className="text-[#FFD700] text-lg mt-4 font-bold">[ INSERT COIN ]</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {events.map((event, index) => (
              <motion.button
                key={event.title}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(event)}
                disabled={result !== null}
                className={`
                  ${cardColor} p-0 cursor-pointer text-left transform transition-transform
                  hover:-translate-y-2 hover:rotate-1
                  ${selected === event.title && result === "correct" ? "mem-card-correct" : ""}
                  ${selected === event.title && result === "wrong" ? "mem-card-wrong" : ""}
                `}
              >
                <div className="h-48 md:h-64 overflow-hidden border-b-4 border-black">
                  <img
                    src={event.image || PLACEHOLDER_IMG}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMG;
                    }}
                  />
                </div>
                <div className="p-4 bg-white border-t-4 border-black">
                  <h3 className="text-black font-black text-lg md:text-xl leading-tight">
                    {event.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-8"
      >
        <div className="mem-display inline-block px-8 py-4 text-3xl">
          SCORE: <span className="text-[#FF69B4]">{score}</span>
        </div>
      </motion.div>
    </div>
  );
}