import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchEventPair, getEarlierEvent } from "../utils/wikiApi";

const COLORS = ['bg-nb-pink', 'bg-nb-yellow', 'bg-nb-purple', 'bg-nb-teal'];

export default function Game({ onGameOver, onScore, onRound }) {
  const [events, setEvents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
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
    if (result !== null || loading || transitioning) return;

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
  }, [result, loading, transitioning, events]);

  const handleAnswer = (selectedEvent) => {
    if (result !== null) return;

    const earlierEvent = getEarlierEvent(events[0], events[1]);
    const isCorrect = selectedEvent && selectedEvent.title === earlierEvent.title;

    setSelected(selectedEvent?.title || null);
    setResult(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      const points = 100 + (timeLeft * 10);
      const newRound = round + 1;
      setScore((prev) => prev + points);
      setRound(newRound);
      setTransitioning(true);
      setTimeout(() => {
        onScore(prev => prev + points);
        onRound(newRound);
        setTransitioning(false);
        loadNewPair();
      }, 1500);
    } else {
      setTimeout(() => {
        onGameOver(score);
      }, 2000);
    }
  };

  const progressPercent = (timeLeft / 15) * 100;

  return (
    <div className="w-full min-h-screen bg-memphis-main p-4 md:p-8 flex flex-col items-center">
      
      {/* HUD de Juego */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 gap-4">
        <div className="nb-card bg-white px-6 py-3 font-black text-2xl rotate-1">
          PUNTOS: {score} | RONDA: {round}
        </div>
        
        <div className="flex-1 h-10 bg-white border-4 border-black relative overflow-hidden">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: `${progressPercent}%` }}
            className="absolute inset-0 bg-nb-yellow border-r-4 border-black"
          />
        </div>

        <div className={`nb-card px-6 py-3 font-black text-2xl -rotate-1 ${timeLeft <= 5 ? "bg-nb-pink" : "bg-nb-teal"}`}>
          {timeLeft}s
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="flex flex-col items-center justify-center mt-20"
          >
            <div className="nb-card bg-nb-purple p-12 text-center rotate-3">
              <h2 className="text-4xl font-black mb-4">CARGANDO...</h2>
              <p className="font-bold">VIAJANDO EN EL TIEMPO</p>
            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            {events.map((event, index) => (
              <motion.button
                key={event.title}
                initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.02, rotate: index === 0 ? -1 : 1 }}
                onClick={() => handleAnswer(event)}
                disabled={result !== null}
                className={`nb-card p-0 flex flex-col overflow-hidden text-left h-full
                  ${selected === event.title && result === "correct" ? "ring-8 ring-nb-teal" : ""}
                  ${selected === event.title && result === "wrong" ? "ring-8 ring-nb-pink" : ""}
                `}
              >
                <div className="h-64 md:h-80 bg-gray-200 border-b-4 border-black relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  {selected === event.title && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/20 font-black text-6xl text-white`}>
                      {result === "correct" ? "✓" : "✗"}
                    </div>
                  )}
                </div>
                <div className={`p-6 flex-1 bg-white`}>
                  <h3 className="text-2xl font-black leading-tight mb-2 uppercase">{event.title}</h3>
                  {result !== null && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-4 nb-card bg-nb-yellow p-3 text-center font-black text-2xl border-4"
                    >
                      AÑO: {event.year}
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Cartel de Feedback */}
      <AnimatePresence>
        {result && (
          <div className="feedback-overlay">
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: result === "correct" ? 5 : -5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className={`feedback-stamp ${result === "correct" ? "stamp-correct" : "stamp-wrong"}`}
            >
              {result === "correct" ? "¡ACIERTO!" : "¡FALLO!"}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
