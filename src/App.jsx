import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Home from "./components/Home";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import Leaderboard from "./components/Leaderboard";

function App() {
  const [screen, setScreen] = useState("home");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const handleStart = () => {
    setScore(0);
    setRound(1);
    setScreen("game");
  };

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    setScreen("gameover");
  };

  const handleRestart = () => {
    setScore(0);
    setRound(1);
    setScreen("game");
  };

  const handleLeaderboard = () => {
    setScreen("leaderboard");
  };

  const handleHome = () => {
    setScreen("home");
  };

  const handleScore = (newScore) => {
    setScore(newScore);
  };

  const handleRound = (newRound) => {
    setRound(newRound);
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <Home key="home" onStart={handleStart} />
        )}
        {screen === "game" && (
          <Game key="game" onGameOver={handleGameOver} onScore={handleScore} />
        )}
        {screen === "gameover" && (
          <GameOver
            key="gameover"
            score={score}
            round={round}
            onRestart={handleRestart}
            onLeaderboard={handleLeaderboard}
            onHome={handleHome}
          />
        )}
        {screen === "leaderboard" && (
          <Leaderboard key="leaderboard" currentScore={score} onRestart={handleRestart} onHome={handleHome} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;