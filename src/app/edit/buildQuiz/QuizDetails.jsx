"use client";

import React, { useState } from "react";
import { HiMiniPencilSquare, HiChevronDown } from "react-icons/hi2";

const QuizDetails = ({ quiz, setOpenEdit }) => {
  const [showObjectives, setShowObjectives] = useState(false);

  return (
    <div>
      <div
        className="
          w-full max-w-3xl
          max-h-[90vh] overflow-y-auto
          bg-white
          rounded-3xl
          border border-slate-200
          shadow-sm
          relative
        "
      >
        {/* Header */}
        <div
          className="
            sticky top-0 z-10
            bg-white/90 backdrop-blur-md
            border-b border-slate-100
            px-6 py-5
            rounded-t-3xl
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <h2
                  className="
                    text-2xl font-bold text-slate-800
                    leading-tight
                    break-words
                  "
                >
                  {quiz?.title || "Untitled"}
                </h2>

                <button
                  onClick={() => setOpenEdit(true)}
                  className="
                    shrink-0
                    mt-1
                    p-1.5 rounded-lg
                    bg-slate-100
                    text-slate-600
                    hover:bg-orange-100
                    hover:text-orange-600
                    transition
                    cursor-pointer
                  "
                >
                  <HiMiniPencilSquare size={18} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span
                  className="
                    px-3 py-1
                    rounded-full
                    text-xs font-semibold
                    text-orange-700
                    bg-orange-100
                    border border-orange-200
                  "
                >
                  {quiz?.subject}
                </span>

                <span
                  className="
                    text-xs font-medium
                    text-slate-500 uppercase
                  "
                >
                  {quiz?.grade} / {quiz?.quarter} Quarter
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Objectives */}
          <div>
            <button
              onClick={() => setShowObjectives((prev) => !prev)}
              className="
              
                flex items-center  
                p-2
                rounded-2xl
                gap-2
                cursor-pointer
                hover:bg-slate-100
                transition
              "
            >
              <h3
                className="
                  text-sm font-semibold
                  text-slate-700
                  uppercase tracking-wide
                "
              >
                Competencies / Objectives
              </h3>

              <HiChevronDown
                size={18}
                className={`
                  transition-transform duration-200
                  ${showObjectives ? "rotate-180" : ""}
                `}
              />
            </button>

            {showObjectives && (
              <div
                className="
                mt-2
                  p-4 rounded-2xl
                  bg-slate-50
                  border border-slate-200
                  text-slate-700
                  leading-relaxed
                  whitespace-pre-line
                "
              >
                {quiz?.objectives || "No competency added"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
