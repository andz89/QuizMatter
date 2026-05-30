import React, { useState, useEffect } from "react";
import { HiMiniPencilSquare, HiOutlineXMark } from "react-icons/hi2";
import Link from "next/link";
import { HiEye, HiEyeSlash, HiOutlineTv } from "react-icons/hi2";
const Presentation = ({ quiz, open, onClose }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState({});
  const [fontSize, setFontSize] = useState(1);
  useEffect(() => {
    const handleFullscreen = async () => {
      if (open && !document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
          document.body.classList.add("overflow-hidden");
        } catch (error) {
          console.log("Fullscreen error:", error);
        }
      }

      if (!open && document.fullscreenElement) {
        document.body.classList.remove("overflow-hidden");
        await document.exitFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        document.body.classList.remove("overflow-hidden");

        onClose();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    handleFullscreen();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      document.body.classList.remove("overflow-hidden");
    };
  }, [open, onClose]);
  if (!open) return null;
  const toggleQuestionAnswer = (questionId) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [questionId]:
        prev[questionId] === undefined ? !showAnswers : !prev[questionId],
    }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 bg-white">
      <div
        className="
          w-full  
          max-h-[100vh] overflow-y-auto
          border border-slate-200
          relative
        "
      >
        {/* Header */}
        <div
          className="
           
            bg-white/90 backdrop-blur-md
            border-b border-slate-100

            p-1
            rounded-t-3xl
          "
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2
                  className="
                   text-[clamp(1.5rem,2.5vw+1rem,4rem)] font-bold text-slate-800
                    leading-tight
                    break-words
                  "
                >
                  {quiz?.title || "Untitled"}
                </h2>
                <div className="flex items-center gap-2">
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
                     text-[clamp(1rem,1vw+1rem,2rem)] font-semibold
                    text-orange-700
                    bg-orange-100
                    border border-orange-200
                  "
                >
                  {quiz?.subject}
                </span>

                <span
                  className="
                        text-[clamp(1rem,1vw+1rem,2rem)] font-medium
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
          {!open && (
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
          )}

          {/* Add more sections here */}
          {/* Example */}

          <div className="space-y-4 text-left">
            {quiz?.questions
              ?.slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((question, index) => {
                const isAnswerVisible =
                  visibleAnswers[question.id] ?? showAnswers;
                return (
                  <div
                    key={question.id}
                    className="text-slate-800 mb-4 leading-tight"
                  >
                    {/* Question */}
                    <h4
                      style={{
                        fontSize: `clamp(${1.2 * fontSize}rem, ${
                          2 * fontSize
                        }vw + 1rem, ${3 * fontSize}rem)`,
                      }}
                      className="text-slate-800 mb-4 leading-tight"
                    >
                      {index + 1}. {question.question}
                    </h4>
                    <button
                      onClick={() => toggleQuestionAnswer(question.id)}
                      className="
    flex items-center gap-2
    px-3 py-2 mb-4
    rounded-xl
    bg-slate-100
    hover:bg-slate-200
    text-slate-700
    transition
    cursor-pointer
  "
                    >
                      {isAnswerVisible ? (
                        <HiEyeSlash size={18} />
                      ) : (
                        <HiEye size={18} />
                      )}

                      <span className="text-sm font-medium">
                        {isAnswerVisible ? "Hide Answer" : "Show Answer"}
                      </span>
                    </button>
                    {/* Options */}
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div
                          key={option.id}
                          className="
  px-4 py-3 rounded-xl
  bg-white
  border border-slate-200
  text-slate-700
"
                          style={{
                            fontSize: `clamp(${1 * fontSize}rem, ${
                              1.5 * fontSize
                            }vw + 1rem, ${2.5 * fontSize}rem)`,
                          }}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>

                          {option.label}

                          {isAnswerVisible &&
                            question.correct === option.option_id && (
                              <span className="ml-2 text-green-600 font-medium">
                                ✓ Correct
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              onClick={() => {
                const next = !showAnswers;

                setShowAnswers(next);

                // when hiding all, also reset individual answers
                if (!next) {
                  setVisibleAnswers({});
                }
              }}
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

              <span className="text-sm font-medium">
                {showAnswers ? "Hide Answers" : "Show Answers"}
              </span>
            </button>
            <button
              onClick={() => setFontSize((prev) => Math.max(0.8, prev - 0.1))}
              className="
      px-4 py-2 rounded-xl
      bg-slate-100
      hover:bg-slate-200
      text-slate-700
      font-bold
    "
            >
              A-
            </button>

            <button
              onClick={() => setFontSize((prev) => Math.min(3, prev + 0.1))}
              className="
      px-4 py-2 rounded-xl
      bg-slate-100
      hover:bg-slate-200
      text-slate-700
      font-bold
    "
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation;
