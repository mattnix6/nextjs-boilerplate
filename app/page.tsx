"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import html2canvas from "html2canvas";
import CustomLineChart from "./components/CustomLineChart";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, annotationPlugin);

export default function Home() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [initialCountdown, setInitialCountdown] = useState(-1);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isKeyDown, setIsKeyDown] = useState(false);
  const [clickData, setClickData] = useState<number[]>([]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setInitialCountdown(3);
    setIsGameActive(false);
    setIsKeyDown(false);
    setClickData(Array(10).fill(0));
  };

  useEffect(() => {
    if (initialCountdown > 0) {
      const countdownTimer = setInterval(() => {
        setInitialCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdownTimer);
    }

    if (initialCountdown === 0) {
      setIsGameActive(true);
    }
  }, [initialCountdown]);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      setIsGameActive(false);  // End game when time is up
    }
  }, [isGameActive, timeLeft]);

  const handleScore = () => {
    if (isGameActive) {
      setScore((prev) => prev + 1);
      setClickData((prev) => {
        const updated = [...prev];
        updated[10 - timeLeft] += 1;
        return updated;
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && isGameActive && !isSpaceDown) {
        event.preventDefault();
        setIsSpaceDown(true);
        setIsKeyDown(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space" && isGameActive && isSpaceDown) {
        event.preventDefault();
        setIsSpaceDown(false);
        handleScore();
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

  const chartData = {
    labels: [...Array(10).keys()].map((i) => `${i + 1}s`),
    datasets: [
      {
        label: "Clicks per second",
        data: clickData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
    plugins: {
      annotation: {
        annotations: {
          low: {
            type: "line" as const,
            yMin: 3,
            yMax: 3,
            borderColor: "green",
            borderWidth: 2,
            label: {
              content: "Low",
              enabled: true,
              position: "start",
              backgroundColor: "rgba(0, 128, 0, 0.8)",
              color: "white",
            },
          },
          medium: {
            type: "line" as const,
            yMin: 6,
            yMax: 6,
            borderColor: "orange",
            borderWidth: 2,
            label: {
              content: "Medium",
              enabled: true,
              position: "start",
              backgroundColor: "rgba(255, 165, 0, 0.8)",
              color: "white",
            },
          },
          high: {
            type: "line" as const,
            yMin: 9,
            yMax: 9,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: "High",
              enabled: true,
              position: "start",
              backgroundColor: "rgba(255, 0, 0, 0.8)",
              color: "white",
            },
          },
        },
      },
    },
  };

  const shareScore = async () => {
    const gameElement = document.getElementById("game-summary");
    if (!gameElement) return;

    const canvas = await html2canvas(gameElement);
    const imageData = canvas.toDataURL("image/png");

    const shareText = `🎮 I scored ${score} points in the Kekety Challenge! Can you beat my score? #KeketyChallenge`;

    if (navigator.canShare()) {
      navigator
        .share({
          title: "Kekety Challenge Score",
          text: shareText,
          url: imageData,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Score shared successfully! Text copied to clipboard.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-4">Kekety Challenge</h1>

      {initialCountdown > 0 ? (
        <p className="text-2xl font-bold mb-8">
          Game starts in: <span className="text-red-600">{initialCountdown}</span>
        </p>
      ) : isGameActive ? (
        <>
          <p className="text-lg mb-4">
            Time left: <span className="font-bold">{timeLeft}s</span>
          </p>
          <p className="text-lg mb-8">
            Score: <span className="font-bold">{score}</span>
          </p>
          <button
            onClick={ !isKeyDown ? handleScore: () => {} }
            className={ isKeyDown ? "cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" }
          >
            Click Me! (or Press Space)
          </button>
          <div className="w-full mt-8 max-w-[500px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      ) : (
        <>
          <p className="text-lg mb-8">
            {timeLeft === 0 ? `Time's up!` : "Ready to play?"}
          </p>
          {timeLeft === 0 && score !== 0 && (
            <>
              <div id="game-summary" className="text-center">
                <p className="text-lg">Your score: {score}</p>
                <div className="w-full max-w-[500px]">
                  <CustomLineChart
                    data={chartData}
                    options={chartOptions}
                    disableAnnotations={true}
                  />
                </div>
              </div>
              <button
                onClick={shareScore}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Share Your Score
              </button>
            </>
          )}
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-8 mt-4"
          >
            {timeLeft === 0 ? `Restart Game` : "Start Game"}
          </button>
        </>
      )}
    </div>
  );
}
