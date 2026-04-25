import React from "react";
import { useQuizStore } from "../../store/QuizStore";
const QuizTypeOptions = ({ questionId, setOpenMenu }) => {
  const { addQuestionAfter } = useQuizStore();

  const handleAdd = (type) => {
    addQuestionAfter(questionId, type);
    setOpenMenu(null);
  };

  return (
    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20">
      <button
        onClick={() => handleAdd("multiple")}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
      >
        Multiple Choice
      </button>

      <button
        onClick={() => handleAdd("boolean")}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
      >
        True / False
      </button>

      <button
        onClick={() => handleAdd("short")}
        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
      >
        Fill in the Blank
      </button>
    </div>
  );
};
export default QuizTypeOptions;
