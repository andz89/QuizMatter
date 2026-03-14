"use client";

import { useState } from "react";

import StartScreen from "./StartScreen";
import QuizScreen from "./QuizScreen";
import ResultScreen from "./ResultScreen";

export default function QuizPage() {
  const [screen, setScreen] = useState("start");
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: "What is 2 + 2?",
      options: [
        { id: 1, label: "3", value: "A" },
        { id: 2, label: "4", value: "B" },
        { id: 3, label: "5", value: "C" },
        { id: 4, label: "6", value: "D" },
      ],
      correct: "B",
    },
    {
      id: 2,
      question: "What is 4 + 4?",
      options: [
        { id: 1, label: "3", value: "A" },
        { id: 2, label: "4", value: "B" },
        { id: 3, label: "8", value: "C" },
        { id: 4, label: "6", value: "D" },
      ],
      correct: "C",
    },
  ];

  const handleFinish = (answers) => {
    let newScore = 0;

    questions.forEach((q) => {
      if (answers[`q_${q.id}`] === q.correct) {
        newScore++;
      }
    });

    setScore(newScore);
    setScreen("result");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex flex-col gap-8">
          {screen === "start" && (
            <StartScreen onStart={() => setScreen("quiz")} />
          )}

          {screen === "quiz" && (
            <QuizScreen questions={questions} onFinish={handleFinish} />
          )}

          {screen === "result" && (
            <ResultScreen
              score={score}
              total={questions.length}
              onRestart={() => setScreen("start")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
