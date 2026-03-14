"use client";

export default function StartScreen({ onStart }) {
  return (
    <div className="text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Quiz Challenge</h2>

          <p className="text-gray-500 text-md">
            Test your knowledge and see how well you score.
          </p>
        </div>

        <button
          onClick={onStart}
          className="bg-blue-600 text-white text-lg px-10 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
