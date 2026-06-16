import { useQuizStore } from "../../store/QuizStore";

import QuizTypeOptions from "./QuizTypeOptions";
import {
  BiDuplicate,
  BiPlus,
  BiSolidTrash,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";

const QuestionOptions = ({ questionLength, questionId }) => {
  const { removeQuestion, duplicateQuestion } = useQuizStore();
  const moveUp = useQuizStore((state) => state.moveQuestionUp);
  const moveDown = useQuizStore((state) => state.moveQuestionDown);

  return (
    <div
      // ref={isActive ? activeRef : null}
      className="flex w-full items-center justify-end gap-2 bg-white border  border-gray-200 p-2  rounded-lg"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col ">
          <button
            className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded-md  bg-white hover:bg-orange-100  hover:border-gray-400 transition"
            onClick={() => moveUp(questionId)}
          >
            <BiChevronUp size={45} className="text-gray-700" />
          </button>
          <button
            className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded-md  bg-white hover:bg-orange-100  hover:border-gray-300 transition"
            onClick={() => moveDown(questionId)}
          >
            <BiChevronDown size={45} className="text-gray-700" />
          </button>
        </div>

        {/* Duplicate */}
        <button
          onClick={() => duplicateQuestion(questionId)}
          className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded  bg-white  hover:bg-orange-100    transition"
        >
          <BiDuplicate size={21} className="text-gray-700  " />
        </button>

        {/* Delete */}

        <button
          disabled={questionLength <= 1}
          onClick={() => removeQuestion(questionId)}
          className={`${
            questionLength <= 1
              ? "cursor-not-allowed   flex items-center justify-center w-8 h-8 rounded  bg-gray-100   transition"
              : "hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded  bg-white hover:bg-orange-100   transition"
          }`}
        >
          <BiSolidTrash size={21} className={"text-gray-600"} />
        </button>
      </div>
    </div>
  );
};

export default QuestionOptions;
