import React from "react";

import { useQuizStore } from "@/src/app/edit/buildQuiz/store/QuizStore";

const FillTheBlankInput = ({ index }) => {
  const { questions, updateQuestion } = useQuizStore();

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">Correct Answer</span>

      <input
        type="text"
        placeholder="Type the correct answer..."
        value={questions[index]?.correct || ""}
        onChange={(e) =>
          updateQuestion(index, {
            correct: e.target.value,
          })
        }
        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

export default FillTheBlankInput;
