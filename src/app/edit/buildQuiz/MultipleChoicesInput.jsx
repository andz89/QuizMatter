import React, { useRef, useEffect, use, useState } from "react";
import { useQuizStore } from "../buildQuiz/store/QuizStore";
import { BsX } from "react-icons/bs";
import { BiGridVertical } from "react-icons/bi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TinyInputEditor from "./editor/TinyInputEditor";

const getOptionLabel = (index) => {
  return String.fromCharCode(65 + index); // 65 = "A"
};
const MultipleChoicesInput = ({
  opt,
  index,
  questionOptionsLength,
  showLabel,
  setActiveEditor,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: opt.option_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateOption = useQuizStore((state) => state.updateOption);
  const updateQuestion = useQuizStore((state) => state.updateQuestion);
  const removeOption = useQuizStore((state) => state.removeOption);

  const questions = useQuizStore((state) => state.questions);
  const question = questions.find((q) => q.question_id === opt.question_id);

  const handleOptionChange = (value) => {
    updateOption(opt.option_id, {
      label: value,
    });
  };

  const handleCorrectChange = () => {
    updateQuestion(opt.question_id, {
      correct: opt.option_id,
    });
  };

  if (!question) return null;

  return (
    <div className="flex flex-row    px-2">
      {/* FIXED label (does NOT move) */}
      {showLabel && (
        <span className="w-[20px] font-bold mt-[6px]">
          {getOptionLabel(index)}.
        </span>
      )}

      {/* DRAGGABLE PART ONLY */}
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-row items-start  flex-1    ml-2"
      >
        {/* Radio */}
        <label className="flex items-start mt-[11px] ">
          <input
            type="radio"
            checked={question.correct === opt.option_id}
            onChange={handleCorrectChange}
            className="ml-[-1] px-0"
          />
        </label>
        {/* Drag handle */}
        <span
          {...listeners}
          {...attributes}
          className="cursor-grab mt-[6px] mr-[-4px] "
        >
          <BiGridVertical size={21} className="text-gray-600 mr-1 " />
        </span>
        {/* Editable */}
        <div className="bg-gray-50 border border-gray-300  rounded  w-full min-w-0 p-2">
          <TinyInputEditor
            value={opt.label || "option here"}
            onChange={handleOptionChange}
            setActiveEditor={setActiveEditor}
            inputFrom={"option"}
          />
        </div>

        {/* Delete */}
        <button
          disabled={questionOptionsLength <= 1}
          onClick={() => removeOption(opt.option_id)}
          className="cursor-pointer"
        >
          <BsX size={33} className="text-slate-500 " />
        </button>
      </div>
    </div>
  );
};
export default MultipleChoicesInput;
