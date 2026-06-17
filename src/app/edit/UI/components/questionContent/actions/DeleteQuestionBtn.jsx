import React from "react";
import {
  BiDuplicate,
  BiPlus,
  BiSolidTrash,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { useQuizStore } from "../../../store/QuizStore";
const DeleteQuestionBtn = ({ questionLength, questionId }) => {
  const { removeQuestion } = useQuizStore();

  return (
    <button
      disabled={questionLength <= 1}
      onClick={() => removeQuestion(questionId)}
      className={`${
        questionLength <= 1
          ? "cursor-not-allowed   flex items-center justify-center w-8 h-8 rounded  bg-gray-100   transition"
          : "hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded    hover:bg-orange-100   transition"
      }`}
    >
      <BiSolidTrash size={21} className={"text-gray-600"} />
    </button>
  );
};

export default DeleteQuestionBtn;
