import React, { useState } from "react";
import { useQuizStore } from "../store/QuizStore";
import { HiChevronDown } from "react-icons/hi2";
import { HiBars3BottomLeft, HiOutlineDocumentText } from "react-icons/hi2";
import { LuText } from "react-icons/lu";
import { BsRecordCircleFill } from "react-icons/bs";
import { BiPlus } from "react-icons/bi";
const QuizTypeOptions = ({
  questionId,
  setOpenMenu,

  isActive,
  activeRef,
}) => {
  // const [open, setOpen] = useState(false);
  const { addQuestionAfter } = useQuizStore();
  const handleAdd = (type) => {
    addQuestionAfter(questionId, type);

    setOpenMenu(null);
  };

  return (
    <div ref={isActive ? activeRef : null} className="group relative py-5">
      <div className="relative  w-full">
        <div className="h-px border-t border-dashed border-slate-300" />

        <button
          onClick={() =>
            setOpenMenu((prev) =>
              prev === (questionId ?? "empty") ? null : (questionId ?? "empty"),
            )
          }
          className="
      absolute left-1/2 top-1/2
      -translate-x-1/2 -translate-y-1/2

      w-10 h-10
      rounded-full
      bg-white
      border border-slate-300
      shadow-sm
  z-10
      flex items-center justify-center

      hover:shadow-md
      hover:scale-105
      hover:bg-slate-50
  opacity-65
  group-hover:opacity-100

  transition-all duration-200
      transition-all duration-200
    

 
    "
        >
          <BiPlus size={22} />
        </button>

        <div
          className={`absolute left-1/2 -translate-x-1/2 -translate-y-45   mt-2  w-56 bg-white border border-slate-300 rounded shadow-lg z-50  
    text-gray-700 transition duration-300 ease-in-out
${isActive ? "opacity-100  " : "opacity-0   - pointer-events-none"}
  `}
        >
          <button
            onClick={() => handleAdd("multiple")}
            className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100"
          >
            <BsRecordCircleFill size={16} />
            Multiple Choice
          </button>

          <button
            onClick={() => handleAdd("short")}
            className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100"
          >
            <HiBars3BottomLeft size={18} />
            Fill in the Blank
          </button>

          <button
            onClick={() => handleAdd("textbox")}
            className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100"
          >
            <LuText size={18} />
            Text Box
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizTypeOptions;
