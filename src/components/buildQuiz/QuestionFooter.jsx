import { useQuizStore } from "../../store/QuizStore";
import { useState } from "react";
import QuizTypeOptions from "./QuizTypeOptions";
import {
  BiDuplicate,
  BiPlus,
  BiSolidTrash,
  BiChevronDown,
  BiChevronUp,
  BiRightArrowAlt,
} from "react-icons/bi";

const QuestionFooter = ({
  questionLength,
  questionId,
  openMenu,
  setOpenMenu,
  isActive,
  activeRef,
  index,
}) => {
  const { removeQuestion, duplicateQuestion } = useQuizStore();
  const moveUp = useQuizStore((state) => state.moveQuestionUp);
  const moveDown = useQuizStore((state) => state.moveQuestionDown);
  const moveTo = useQuizStore((state) => state.moveQuestionTo);

  const [target, setTarget] = useState("");

  if (index < 0 || index >= questionLength) {
    // optional: show error or ignore
    return;
  }
  return (
    <div
      ref={isActive ? activeRef : null}
      className="flex w-full items-center justify-between gap-2"
    >
      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 w-fit">
        <input
          type="number"
          min="1"
          placeholder="#"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const index = parseInt(target, 10) - 1;
              if (!isNaN(index)) {
                moveTo(questionId, index);
                setTarget("");
              }
            }
          }}
          className="w-12 text-sm text-center bg-transparent outline-none 
               placeholder-gray-400"
        />

        <button
          onClick={() => {
            const index = parseInt(target, 10) - 1;
            if (!isNaN(index)) {
              moveTo(questionId, index);
              setTarget("");
            }
          }}
          className="p-1 rounded hover:bg-gray-200 transition"
          title="Move"
        >
          <BiRightArrowAlt className="text-lg text-gray-600" />
        </button>
      </div>
      <div className="flex gap-2">
        <div className="flex gap-2">
          <button
            className="hover:cursor-pointer flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-100 hover:border-gray-400 transition"
            onClick={() => moveUp(questionId)}
          >
            <BiChevronUp size={28} />
          </button>
          <button
            className="hover:cursor-pointer flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-100 hover:border-gray-400 transition"
            onClick={() => moveDown(questionId)}
          >
            <BiChevronDown size={28} />
          </button>
        </div>
        {/* Add */}
        <div className="relative">
          <button
            onClick={() =>
              setOpenMenu(openMenu === questionId ? null : questionId)
            }
            className="hover:cursor-pointer flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-100 hover:border-gray-400 transition"
          >
            <BiPlus size={16} className="text-gray-700" />
          </button>

          {openMenu === questionId && (
            <QuizTypeOptions
              questionId={questionId}
              setOpenMenu={setOpenMenu}
            />
          )}
        </div>

        {/* Duplicate */}
        <button
          onClick={() => duplicateQuestion(questionId)}
          className="hover:cursor-pointer flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-400 transition"
        >
          <BiDuplicate
            size={16}
            className="text-gray-700 hover:text-blue-600"
          />
        </button>

        {/* Delete */}

        <button
          disabled={questionLength <= 1}
          onClick={() => removeQuestion(questionId)}
          className={`${
            questionLength <= 1
              ? "cursor-not-allowed   flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-gray-100   transition"
              : "hover:cursor-pointer flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-red-50 hover:border-red-400 transition"
          }`}
        >
          <BiSolidTrash
            size={16}
            className={`${
              questionLength <= 1
                ? "text-gray-400"
                : "text-gray-700 hover:text-red-400"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default QuestionFooter;
