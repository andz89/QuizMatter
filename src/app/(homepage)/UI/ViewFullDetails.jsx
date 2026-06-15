import React, { useState } from "react";
import { HiMiniPencilSquare, HiOutlineXMark } from "react-icons/hi2";
import Link from "next/link";
import { BsArrowsAngleExpand } from "react-icons/bs";

import { HiEye, HiEyeSlash, HiOutlineTv } from "react-icons/hi2";
import addQuestionNumbers from "@/src/app/utils/lib/addQuestionNumbers";

const ViewFullDetails = ({ quiz, open, onClose, setMode }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  // if you want to remove this, replace the itemsWithNumbers before map with questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const itemsWithNumbers = addQuestionNumbers(
    quiz?.questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  );
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          w-full max-w-3xl
          max-h-[90vh] overflow-y-auto

          bg-white
          rounded-3xl
          border border-slate-200
          shadow-2xl

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
            {/* Left */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2
                  className="
                    text-2xl font-bold text-slate-800
                    leading-tight
                    break-words
                  "
                >
                  {quiz?.title || "Untitled"}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMode("update")}
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
                    <HiMiniPencilSquare size={22} />
                  </button>
                  <button
                    className="
                    shrink-0
                    mt-1
                    p-1.5 rounded-lg
                    bg-slate-100
                    text-slate-600
                    hover:bg-orange-100
                    hover:text-orange-600
                    transition
                    cursor-pointer"
                    onClick={() => setMode("present")}
                  >
                    <BsArrowsAngleExpand
                      size={20}
                      className="  text-slate-800 hover:text-orange-500 transition  cursor-pointer  "
                    />
                  </button>
                  <button
                    className="
                    shrink-0
                    mt-1
                    p-1.5 rounded-lg
                    bg-slate-100
                    text-slate-600
                    hover:bg-orange-100
                    hover:text-orange-600
                    transition
                    cursor-pointer"
                    onClick={onClose}
                  >
                    <HiOutlineXMark size={22} />
                  </button>
                </div>
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

            {/* <button
              onClick={onClose}
              className="
                shrink-0
                p-2 rounded-xl
                text-slate-500
                hover:bg-red-100
                hover:text-red-500
                transition
                cursor-pointer
              "
            >
              <HiOutlineXMark size={22} />
            </button> */}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Objectives */}
          <div>
            <h3
              className="
                text-sm font-semibold
                text-slate-700
                uppercase tracking-wide
                mb-2
              "
            >
              Competencies / Objectives
            </h3>

            <div
              className="
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
          </div>

          {/* Add more sections here */}
          {/* Example */}

          <div className="space-y-4 text-left">
            {itemsWithNumbers?.map((question, index) => (
              <div
                key={question.id}
                className="
        p-5 rounded-2xl
        border border-slate-200
        bg-slate-50 
      "
              >
                {question.type === "textbox" && (
                  <div className="p-2 w-full bg-white">
                    {/* Title */}
                    <h2
                      className="text-2xl text-slate-800 font-600 leading-tight tracking-tight border-b border-gray-300"
                      dangerouslySetInnerHTML={{
                        __html: question.title,
                      }}
                    />

                    {/* Description */}
                    {question.description && (
                      <div
                        className="text-md bg-white w-full
          mt-4
          text-slate-600
          leading-relaxed
        
          [&_ul]:list-disc
          [&_ul]:ml-6
          [&_ol]:list-decimal
          [&_ol]:ml-6
        "
                        dangerouslySetInnerHTML={{
                          __html: question.description,
                        }}
                      />
                    )}
                  </div>
                )}

                {["multiple", "short"].includes(question.type) && (
                  <h4 className=" flex  font-semibold text-slate-800 mb-4 min-h-[40px] p-2 focus:outline-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6">
                    <span className="mr-1"> {question.questionNumber}.</span>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: question.question,
                      }}
                    />
                  </h4>
                )}

                {/* Options */}
                <div
                  className={`gap-2    ${
                    question.layout === "row"
                      ? "flex flex-row flex-wrap justify-around"
                      : question.layout === "grid"
                        ? "grid grid-cols-2 w-full"
                        : "flex flex-col flex-base"
                  }`}
                >
                  {question.options
                    ?.slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((option, optionIndex) => (
                      <div
                        key={option.id}
                        className={`flex px-4 py-2 text-slate-700 border border-slate-300 rounded-lg ${
                          showAnswers && question.correct === option.option_id
                            ? "bg-green-200"
                            : "bg-white"
                        }`}
                      >
                        {question.showLabel && (
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                        )}

                        <div
                          dangerouslySetInnerHTML={{
                            __html: option.label,
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            sticky bottom-0
            bg-white/90 backdrop-blur-md
            border-t border-slate-100
            flex justify-between items-center
            px-6 py-4
            rounded-b-3xl
          "
        >
          <div className="flex justify-end">
            <button
              onClick={() => setShowAnswers((prev) => !prev)}
              className="
      flex items-center gap-2
      px-4 py-2
      rounded-xl
      bg-slate-100
      hover:bg-slate-200
      text-slate-700
      transition
      cursor-pointer
    "
            >
              {showAnswers ? <HiEyeSlash size={18} /> : <HiEye size={18} />}

              {/* <span className="text-sm font-medium">
                {showAnswers ? "Hide Answers" : "Show Answers"}
              </span> */}
            </button>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/edit/${quiz.id}`}
              target="_blank"
              className="
                px-4 py-2 rounded-xl
                text-sm font-medium  bg-slate-500
                flex items-center gap-2
                hover:opacity-90
                shadow-sm
                transition text-white"
            >
              <HiMiniPencilSquare size={22} /> Edit Question
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFullDetails;
