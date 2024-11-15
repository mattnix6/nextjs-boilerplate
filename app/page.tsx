"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false); // État de la touche "Espace"

  // Gestion du timer
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) setIsGameActive(false);
  }, [isGameActive, timeLeft]);

  // Fonction pour démarrer le jeu
  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsGameActive(true);
  };

  // Fonction pour incrémenter le score (appelée lors de `keyup`)
  const handleScore = () => {
    if (isGameActive) setScore((prev) => prev + 1);
  };

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && isGameActive && !isSpaceDown) {
        event.preventDefault(); // Empêche le défilement de la page
        setIsSpaceDown(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space" && isGameActive && isSpaceDown) {
        event.preventDefault();
        setIsSpaceDown(false);
        handleScore(); // Incrémente le score
      }
    };

    if (isGameActive) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGameActive, isSpaceDown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-4">Kekety Challenge</h1>

      {isGameActive ? (
        <>
          <p className="text-lg mb-4">
            Time left: <span className="font-bold">{timeLeft}s</span>
          </p>
          <p className="text-lg mb-8">
            Score: <span className="font-bold">{score}</span>
          </p>
          <button
            onClick={handleScore}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Click Me! (or Press Space)
          </button>
        </>
      ) : (
        <>
          <p className="text-lg mb-8">
            {timeLeft === 0 ? `Time's up! Your score: ${score}` : "Ready to play?"}
          </p>
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </>
      )}
    </div>
  );
}
