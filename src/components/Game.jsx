import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  consumePreloadedPair,
  ensurePreloaded,
  getQueueSize,
  resetPreloadQueue,
  subscribeToQueue,
  getEarlierEvent,
} from "../utils/wikiApi";
import { randomPhrase } from "../utils/loadingPhrases";

export default function Game({ onGameOver, onScore, onRound, onHome }) {
  const [events, setEvents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPhrase, setLoadingPhrase] = useState(() => randomPhrase());
  const [connectionError, setConnectionError] = useState(false);

  const roundRef = useRef(1);
  const scoreRef = useRef(0);
  const timerRef = useRef(null);
  const isActiveRef = useRef(false);
  const errorTimerRef = useRef(null);
  const queueUnsubRef = useRef(null);

  const clearErrorTimer = () => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  };

  const startErrorTimer = useCallback(() => {
    clearErrorTimer();
    errorTimerRef.current = setTimeout(() => {
      if (isActiveRef.current) setConnectionError(true);
    }, 15000);
  }, []);

  const loadNextPair = useCallback(() => {
    if (!isActiveRef.current) return false;
    const pair = consumePreloadedPair();
    if (!pair) return false;
    setEvents(pair);
    setSelected(null);
    setResult(null);
    setTimeLeft(15);
    setLoading(false);
    setConnectionError(false);
    clearErrorTimer();
    if (getQueueSize() < 3) ensurePreloaded(5);
    return true;
  }, []);

  const waitForPair = useCallback(() => {
    setLoading(true);
    startErrorTimer();
    if (queueUnsubRef.current) queueUnsubRef.current();
    queueUnsubRef.current = subscribeToQueue(() => {
      if (loadNextPair()) {
        if (queueUnsubRef.current) {
          queueUnsubRef.current();
          queueUnsubRef.current = null;
        }
      }
    });
  }, [loadNextPair, startErrorTimer]);

  const handleRetry = useCallback(() => {
    setConnectionError(false);
    ensurePreloaded(3);
    waitForPair();
  }, [waitForPair]);

  useEffect(() => {
    isActiveRef.current = true;

    // Anti-cheat: each new game starts with a clean queue so questions never
    // repeat after Play Again.
    resetPreloadQueue();
    ensurePreloaded(5);

    if (!loadNextPair()) {
      waitForPair();
    }

    return () => {
      isActiveRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      clearErrorTimer();
      if (queueUnsubRef.current) {
        queueUnsubRef.current();
        queueUnsubRef.current = null;
      }
    };
  }, [loadNextPair, waitForPair]);

  // Rotate humorous loading phrases every 1.8s while loading.
  useEffect(() => {
    if (!loading || connectionError) return;
    const id = setInterval(() => {
      setLoadingPhrase(randomPhrase());
    }, 1800);
    return () => clearInterval(id);
  }, [loading, connectionError]);

  const handleAnswer = (selectedEvent) => {
    if (result !== null || !isActiveRef.current) return;

    const earlierEvent = getEarlierEvent(events[0], events[1]);
    const isCorrect = selectedEvent && selectedEvent.title === earlierEvent.title;

    setSelected(selectedEvent?.title || null);
    setResult(isCorrect ? "correct" : "wrong");

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isCorrect) {
      const points = 100 + (timeLeft * 10);
      const newRound = roundRef.current + 1;
      setScore((prev) => prev + points);
      scoreRef.current += points;
      setRound(newRound);
      roundRef.current = newRound;
      setTimeout(() => {
        onScore(scoreRef.current);
        onRound(newRound);
        if (!loadNextPair()) {
          waitForPair();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        onGameOver(scoreRef.current);
      }, 2000);
    }
  };

  const progressPercent = (timeLeft / 15) * 100;

  useEffect(() => {
    if (result !== null || loading || !isActiveRef.current) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [result, loading, handleAnswer]);

  return (
    <div className="w-full bg-memphis-main p-2 md:p-8 flex flex-col items-center">

      {/* HUD de Juego */}
      <div className="w-full max-w-5xl flex justify-between items-center gap-2 md:gap-4 mb-2 md:mb-8">
        <div className="nb-card bg-white px-2 md:px-6 py-1 md:py-3 font-black text-xs md:text-2xl rotate-1">
          PUNTOS: {score} | RONDA: {round}
        </div>

        <div className="flex-1 h-6 md:h-10 bg-white border-3 md:border-4 border-black relative overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${progressPercent}%` }}
            className="absolute inset-0 bg-nb-yellow border-r-3 md:border-r-4 border-black"
          />
        </div>

        <div className={`nb-card px-2 md:px-6 py-1 md:py-3 font-black text-xs md:text-2xl -rotate-1 ${timeLeft <= 5 ? "bg-nb-pink" : "bg-nb-teal"}`}>
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
            className="flex flex-1 items-center justify-center w-full px-4"
          >
            {connectionError ? (
              <div className="nb-card bg-nb-pink p-6 md:p-10 text-center max-w-md flex flex-col gap-4 items-center">
                <h2 className="text-2xl md:text-4xl font-black">¡UPS!</h2>
                <p className="font-bold text-sm md:text-base uppercase leading-snug">
                  No pudimos conectar con Wikipedia. Comprueba tu conexión e inténtalo de nuevo.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <motion.button
                    onClick={handleRetry}
                    whileHover={{ scale: 1.04, rotate: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="nb-btn text-black font-black text-base md:text-lg py-3 px-6"
                    style={{ backgroundColor: '#FFF44F' }}
                  >
                    REINTENTAR
                  </motion.button>
                  <motion.button
                    onClick={onHome}
                    whileHover={{ scale: 1.04, rotate: 1 }}
                    whileTap={{ scale: 0.96 }}
                    className="nb-btn text-black font-black text-base md:text-lg py-3 px-6"
                    style={{ backgroundColor: '#C77DFF' }}
                  >
                    VOLVER A HOME
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="nb-card bg-nb-purple p-6 md:p-12 text-center rotate-3 max-w-md">
                <h2 className="text-2xl md:text-4xl font-black mb-2 md:mb-4">CARGANDO...</h2>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingPhrase}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="font-bold text-sm md:text-base uppercase"
                  >
                    {loadingPhrase}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-12 mt-1 md:mt-4">
            {events.map((event, index) => (
              <motion.button
                key={event.title}
                initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.02, rotate: index === 0 ? -1 : 1 }}
                onClick={() => handleAnswer(event)}
                disabled={result !== null}
                className={`nb-card p-0 flex flex-col overflow-hidden text-left
                  ${selected === event.title && result === "correct" ? "ring-2 md:ring-8 ring-nb-teal" : ""}
                  ${selected === event.title && result === "wrong" ? "ring-2 md:ring-8 ring-nb-pink" : ""}
                `}
              >
                <div className="h-48 md:h-64 lg:h-80 bg-gray-200 border-b-3 md:border-b-4 border-black relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  {selected === event.title && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/30 font-black text-4xl md:text-6xl text-white`}>
                      {result === "correct" ? "✓" : "✗"}
                    </div>
                  )}
                </div>
                <div className={`p-2 md:p-6 bg-white flex-1 overflow-auto`}>
                  <h3 className="text-base md:text-2xl font-black leading-tight uppercase">{event.title}</h3>
                  {result !== null && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2 md:mt-4 nb-card bg-nb-yellow p-1 md:p-3 text-center font-black text-sm md:text-2xl border-3 md:border-4"
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
