import React from "react";
import { useQuizStore } from "../buildQuiz/store/QuizStore";
const QuizTypeOptions = ({ questionId, setOpenMenu }) => {
  const { addQuestionAfter } = useQuizStore();

  const handleAdd = (type) => {
    addQuestionAfter(questionId, type);
    setOpenMenu(null);
  };

  return (
    <div className="absolute left-0 mt-[-125] w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-2">
      <button
        onClick={() => handleAdd("multiple")}
        className="w-full text-left px-3 py-1 text-md hover:bg-gray-100"
      >
        Multiple Choice
      </button>

      <button
        onClick={() => handleAdd("short")}
        className="w-full text-left px-3 py-1 text-md hover:bg-gray-100"
      >
        Fill in the Blank
      </button>
    </div>
  );
};
export default QuizTypeOptions;
