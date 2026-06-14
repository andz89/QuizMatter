import React, { useRef, useEffect, use, useState, useCallback } from "react";
import { useQuizStore } from "./store/QuizStore";
import { BsX } from "react-icons/bs";
import { BiGridVertical } from "react-icons/bi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TinyInputEditor from "./editor/TinyInputEditor";
import { HiTrash } from "react-icons/hi2";
import SortableOption from "./SortableOption";
const getOptionLabel = (index) => {
  return String.fromCharCode(65 + index); // 65 = "A"
};
const MultipleChoicesInput = ({
  opt,
  index,

  showLabel,
  setActiveEditor,
  correctAnswer,
}) => {
  console.log("RENDER options", opt.option_id);
  const [deleteOptionId, setDeleteOptionId] = useState(null);
  const updateOption = useQuizStore((state) => state.updateOption);
  const updateQuestion = useQuizStore((state) => state.updateQuestion);
  const removeOption = useQuizStore((state) => state.removeOption);

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
    removeOption(deleteOptionId);
  };

  const handleFocus = useCallback(() => {
    setDeleteOptionId(opt.option_id);
  }, []);
  const handleBlur = useCallback(() => {
    setDeleteOptionId(null);
  }, []);
  return (
    <div className="flex flex-row ">
      {showLabel && (
        <span className="font-bold mt-[6px]">{getOptionLabel(index)}.</span>
      )}

      <SortableOption id={opt.option_id}>
        {({ attributes, listeners }) => (
          <div className="flex flex-row items-start flex-1">
            <label className="flex items-start mt-[11px] ">
              <input
                type="radio"
                checked={correctAnswer === opt.option_id}
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
                onFocus={handleFocus}
                setActiveEditor={setActiveEditor}
                onBlur={handleBlur}
                inputFrom={"option"}
                deleteOptionId={deleteOptionId}
              />
            </div>
            <span
              {...attributes}
              {...listeners}
              className="relative cursor-grab mt-[8px] ml-[-12px]"
            >
              <BiGridVertical size={18} className="text-gray-600 mr-1" />
            </span>
            <div className="relative">
              {deleteOptionId === opt.option_id && (
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
          </div>
        )}
      </SortableOption>
    </div>
  );
};
export default React.memo(MultipleChoicesInput);
