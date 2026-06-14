import React, { useState } from "react";
import { useQuizStore } from "./store/QuizStore";
import { HiChevronDown } from "react-icons/hi2";
import { HiBars3BottomLeft, HiOutlineDocumentText } from "react-icons/hi2";
import { LuText } from "react-icons/lu";
import { BsRecordCircleFill } from "react-icons/bs";
import { BiPlus } from "react-icons/bi";
const QuizTypeOptions = ({
  questionId,
  setOpenMenu,
  setOpenMenuBelow = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const { addQuestionAfter } = useQuizStore();
  const handleAdd = (type) => {
    addQuestionAfter(questionId, type);
    setOpen(false);
    setOpenMenu(null);
    setOpenMenuBelow(false);
  };

  return (
    <div className="relative  ">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center  px-3  py-2 border rounded-lg border-slate-300  bg-white hover:bg-gray-50 text-gray-700 cursor-pointer   "
      >
        <BiPlus size={20} />
        {/* <HiChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        /> */}
      </button>

      {open && (
        <div
          className={`absolute left-0 mt-2 w-56 bg-white border border-slate-300 rounded shadow-lg z-50
    origin-top-left text-gray-700
    transition-all duration-200 ease-out
    ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
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
      )}
    </div>
  );
};

export default QuizTypeOptions;
