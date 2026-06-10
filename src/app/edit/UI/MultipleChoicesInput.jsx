import React, { useRef, useEffect, use, useState } from "react";
import { useQuizStore } from "./store/QuizStore";
import { BsX } from "react-icons/bs";
import { BiGridVertical } from "react-icons/bi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TinyInputEditor from "./editor/TinyInputEditor";
import { HiTrash } from "react-icons/hi2";

const getOptionLabel = (index) => {
  return String.fromCharCode(65 + index); // 65 = "A"
};
const MultipleChoicesInput = ({
  opt,
  index,
  questionOptionsLength,
  showLabel,
  setActiveEditor,
  setDeleteOptionId,
  deleteOptionId,
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
  const handleDeleteOption = () => {
    removeOption(deleteOptionId.option_id);
  };
  if (!question) return null;

  return (
    <div className="flex flex-row ">
      {showLabel && (
        <span className="font-bold mt-[6px]">{getOptionLabel(index)}.</span>
      )}

      {/* DRAGGABLE PART ONLY */}
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-row items-start  flex-1 "
      >
        {/* Radio */}
        <label className="flex items-start mt-[11px] ">
          <input
            type="radio"
            checked={question.correct === opt.option_id}
            onChange={handleCorrectChange}
            className="mx-2 px-0"
          />
        </label>
        {/* Drag handle */}

        {/* Editable */}
        <div className="bg-gray-50 border border-gray-300  rounded  w-full min-w-0 py-1 pl-1 pr-3">
          <TinyInputEditor
            optionDetails={opt}
            value={opt.label || "option here"}
            onChange={handleOptionChange}
            setDeleteOptionId={setDeleteOptionId}
            setActiveEditor={setActiveEditor}
            inputFrom={"option"}
          />
        </div>
        <span
          {...listeners}
          {...attributes}
          className="relative cursor-grab mt-[8px] ml-[-12px]  "
        >
          <BiGridVertical size={18} className="text-gray-600 mr-1 " />
        </span>
        <div className="relative">
          {deleteOptionId?.option_id === opt.option_id && (
            <div className="  absolute bg-slate-200  w-[20px] h-[30px] rounded flex items-center justify-center top-[-27px] right-[-15px]">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleDeleteOption();
                }}
              >
                <HiTrash className="text-slate-500 text-lg cursor-pointer transition" />
              </button>
            </div>
          )}
        </div>
        {/* Delete */}
        {/* <button
          disabled={questionOptionsLength <= 1}
          // onClick={() => removeOption(opt.option_id)}
          onClick={() => setDeleteOptionId(opt.option_id)}
          className="cursor-pointer"
        >
          <BsX size={33} className="text-slate-500 " />
        </button> */}
      </div>
    </div>
  );
};
export default MultipleChoicesInput;
