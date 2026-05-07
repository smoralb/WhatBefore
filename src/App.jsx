import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Home from "./components/Home";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import Leaderboard from "./components/Leaderboard";

function App() {
  const [screen, setScreen] = useState("home");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [savedUsername, setSavedUsername] = useState("");
  const [userExistsInSupabase, setUserExistsInSupabase] = useState(null);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

  useEffect(() => {
    const saved = localStorage.getItem("whatbefore_username");
    if (saved) {
      setSavedUsername(saved);
      checkUserExists(saved);
    }
  }, []);

  const checkUserExists = async (username) => {
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    
    try {
      const encodedUsername = encodeURIComponent(username);
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/scores?username=eq.${encodedUsername}`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      const data = await response.json();
      setUserExistsInSupabase(data.length > 0);
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

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

  const handleSaveScore = async (username, newScore, isUpdate = false) => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("Supabase not configured");
      return;
    }
    
    try {
      const encodedUsername = encodeURIComponent(username);
      console.log("Saving score for:", username, "encoded:", encodedUsername);
      
      const getResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/scores?username=eq.${encodedUsername}`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      
      const existingScores = await getResponse.json();
      console.log("Existing scores:", existingScores);
      
      if (existingScores.length > 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/scores?username=eq.${encodedUsername}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            score: newScore,
            rounds: round - 1
          })
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            username: username,
            score: newScore,
            rounds: round - 1
          })
        });
        
        localStorage.setItem("whatbefore_username", username);
        setSavedUsername(username);
        setUserExistsInSupabase(true);
      }

      handleLeaderboard();
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <Home key="home" onStart={handleStart} onLeaderboard={handleLeaderboard} />
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
            savedUsername={savedUsername}
            userExistsInSupabase={userExistsInSupabase}
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