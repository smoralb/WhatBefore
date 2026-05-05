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

  const SUPABASE_URL = "https://wbofcwuyhhguyripiueq.supabase.co";
  const SUPABASE_KEY = "sb_publishable_QKhDFg_CKcdVSVo4pgyhmg_cMWxove3";

  const handleSaveScore = async (username, score) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          username: username,
          score: score,
          rounds: round - 1
        })
      });

      if (response.ok) {
        handleLeaderboard();
      } else {
        console.error("Error saving score:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <Home key="home" onStart={handleStart} />
        )}
        {screen === "game" && (
          <Game key="game" onGameOver={handleGameOver} onScore={handleScore} onRound={handleRound} />
        )}
        {screen === "gameover" && (
          <GameOver
            key="gameover"
            score={score}
            round={round}
            onRestart={handleRestart}
            onLeaderboard={handleLeaderboard}
            onHome={handleHome}
            onSaveScore={handleSaveScore}
          />
        )}
        {screen === "leaderboard" && (
          <Leaderboard key="leaderboard" onRestart={handleRestart} onHome={handleHome} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;