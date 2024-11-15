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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, annotationPlugin);

export default function Home() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameActive, setIsGameActive] = useState(false);
  const [clickData, setClickData] = useState<number[]>([]); // Correctly typed as an array of numbers

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsGameActive(true);
    setClickData(Array(10).fill(0)); // This will now work
  };

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      setIsGameActive(false);
    }
  }, [isGameActive, timeLeft]);

  const handleScore = () => {
    if (isGameActive) {
      setScore((prev) => prev + 1);
      setClickData((prev) => {
        const updated = [...prev];
        updated[10 - timeLeft] += 1; // Increment click count for the current second
        return updated;
      });
    }
  };

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
            type: "line",
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
            type: "line",
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
            type: "line",
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

  // Event listener for space key press to count clicks
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && isGameActive) {
        event.preventDefault(); // Prevent default spacebar behavior (scrolling)
        handleScore();
      }
    };

    if (isGameActive) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameActive, timeLeft]);

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
          <div className="w-full mt-8">
            <Line data={chartData} options={chartOptions} />
          </div>
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
