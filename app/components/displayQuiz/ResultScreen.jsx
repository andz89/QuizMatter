"use client";

export default function ResultScreen({ score, total, onRestart }) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="text-center">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-semibold">Quiz Finished</h2>

        <p className="text-lg font-medium">Your Score</p>

        <span className="text-2xl px-6 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">
          {score} / {total}
        </span>

        <p className="text-gray-500">{percentage}% correct answers</p>

        <button
          onClick={onRestart}
          className="bg-blue-600 text-white text-lg px-10 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
