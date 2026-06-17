import React from "react";
import { useQuizStore } from "../../store/QuizStore";
import { BiDuplicate } from "react-icons/bi";

const DuplicateQuestionBtn = ({ questionId }) => {
  const { duplicateQuestion } = useQuizStore();

  return (
    <button
      onClick={() => duplicateQuestion(questionId)}
      className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded    hover:bg-orange-100    transition"
    >
      <BiDuplicate size={21} className="text-gray-700  " />
    </button>
  );
};

export default DuplicateQuestionBtn;
