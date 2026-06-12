import React from "react";
import { useQuizStore } from "./store/QuizStore";
const QuizTypeOptions = ({
  questionId,
  setOpenMenu,
  setOpenMenuBelow = () => {},
}) => {
  const { addQuestionAfter } = useQuizStore();

  const handleAdd = (type) => {
    addQuestionAfter(questionId, type);
    setOpenMenu(null);
    setOpenMenuBelow(false);
  };

  return (
    <div>
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
      <button
        onClick={() => handleAdd("textbox")}
        className="w-full text-left px-3 py-1 text-md hover:bg-gray-100"
      >
        Text Box
      </button>
    </div>
  );
};
export default QuizTypeOptions;
