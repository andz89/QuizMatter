import React, { useState, useCallback } from "react";
import { useQuizStore } from "../../store/QuizStore";

import { BiGridVertical } from "react-icons/bi";

import TinyInputEditor from "../../editor/TinyInputEditor";
import { HiTrash } from "react-icons/hi2";
import SortableElement from "./dndkit/DragElement";
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

      <SortableElement id={opt.option_id}>
        {({ attributes, listeners }) => (
          <div className="flex flex-row items-start flex-1">
            <label className="flex items-start mt-[11px] ">
              <input
                type="radio"
                checked={correctAnswer === opt.option_id}
                onChange={handleCorrectChange}
                className="accent-orange-600  px-0 w-4 h-4 mx-2"
              />
            </label>
            {/* Drag handle */}
            {/* Editable */}
            <div className="bg-gray-50 border-b   border-gray-300 p-2   w-full">
              <TinyInputEditor
                isOptionNew={opt.isNew}
                value={opt.label}
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
              className="relative cursor-grab  ml-[-12px] hidden md:block"
            >
              <BiGridVertical size={20} className="text-gray-500 mr-1" />
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
      </SortableElement>
    </div>
  );
};
export default React.memo(MultipleChoicesInput);
