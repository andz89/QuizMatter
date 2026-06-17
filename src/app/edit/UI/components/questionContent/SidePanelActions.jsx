import { useQuizStore } from "../../store/QuizStore";

import {
  BiDuplicate,
  BiPlus,
  BiSolidTrash,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import DuplicateQuestionBtn from "./actions/DuplicateQuestionBtn";
import DeleteQuestionBtn from "./actions/DeleteQuestionBtn";
export const QuestionOptionsDesktop = ({ questionLength, questionId }) => {
  return (
    <div
      // ref={isActive ? activeRef : null}
      className="flex w-full items-center justify-end gap-2 bg-white border  border-gray-200 p-2  rounded-lg"
    >
      <div className="flex flex-col gap-2">
        {/* Duplicate */}
        <DuplicateQuestionBtn questionId={questionId} />

        {/* Delete */}
        <DeleteQuestionBtn
          questionId={questionId}
          questionLength={questionLength}
        />
      </div>
    </div>
  );
};

export const QuestionOptionsMobile = ({ questionLength, questionId }) => {
  const { removeQuestion, duplicateQuestion } = useQuizStore();
  const moveUp = useQuizStore((state) => state.moveQuestionUp);
  const moveDown = useQuizStore((state) => state.moveQuestionDown);

  return (
    <div
      // ref={isActive ? activeRef : null}
      className="flex w-full items-center justify-end gap-1   px-2 py-1   "
    >
      <div className="flex gap-1 items-center">
        <div className="flex items-center">
          <button
            className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded-md   hover:bg-orange-100  hover:border-gray-400 transition"
            onClick={() => moveUp(questionId)}
          >
            <BiChevronUp size={45} className="text-gray-700" />
          </button>
          <button
            className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded-md   hover:bg-orange-100  hover:border-gray-300 transition"
            onClick={() => moveDown(questionId)}
          >
            <BiChevronDown size={45} className="text-gray-700" />
          </button>
        </div>

        {/* Duplicate */}

        <DuplicateQuestionBtn questionId={questionId} />

        {/* Delete */}
        <DeleteQuestionBtn
          questionId={questionId}
          questionLength={questionLength}
        />
      </div>
    </div>
  );
};

export default QuestionOptionsMobile;
