import React, { useState, useEffect } from "react";
import { HiMiniPencilSquare, HiOutlineXMark } from "react-icons/hi2";
import Link from "next/link";
import { HiEye, HiEyeSlash, HiOutlineTv } from "react-icons/hi2";
import { BsArrowsAngleContract } from "react-icons/bs";
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
    <div className="fixed inset-0 z-52 flex flex-col justify-center   bg-white">
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

            p-5
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
        <div className="px-2 py-5 space-y-6">
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

          <div className=" text-left">
            {quiz?.questions
              ?.slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((question, index) => {
                const isAnswerVisible =
                  visibleAnswers[question.id] ?? showAnswers;
                return (
                  <div
                    key={question.id}
                    className="text-slate-800 mb-5 leading-tight border border-gray-400 p-4 rounded-2xl    border border-slate-200
        bg-slate-50  "
                  >
                    <button
                      onClick={() => toggleQuestionAnswer(question.id)}
                      className="
    flex items-center gap-2
    px-3 py-2  
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
                    </button>
                    {/* Question */}
                    <h4
                      style={{
                        fontSize: `clamp(${1.2 * fontSize}rem, ${
                          2 * fontSize
                        }vw + 1rem, ${3 * fontSize}rem)`,
                      }}
                      className="  flex text-slate-800 mb-4 leading-tight min-h-[40px] p-2 focus:outline-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6"
                    >
                      {index + 1}.{" "}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: question.question,
                        }}
                      />
                    </h4>

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
                            key={option.option_id}
                            className={`flex px-4 py-2 text-slate-700 border border-slate-300 rounded-lg ${
                              isAnswerVisible &&
                              question.correct === option.option_id
                                ? "bg-green-200"
                                : "bg-white"
                            }`}
                            style={{
                              fontSize: `clamp(${1 * fontSize}rem, ${
                                1.5 * fontSize
                              }vw + 1rem, ${2.5 * fontSize}rem)`,
                            }}
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
                );
              })}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div
        className="
            sticky bottom-0
            bg-slate-800  
              h-40
            flex justify-between items-center
            px-6  
      
          "
      >
        <div className="flex items-center justify-end gap-6 w-full">
          <div className="flex items-center gap-2"></div>
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
   
   
    
    
      transition
      cursor-pointer
    "
          >
            <span className="text-lg text-white hover:text-orange-500 transition">
              {showAnswers ? <HiEyeSlash size={20} /> : <HiEye size={20} />}
            </span>
            {/* <span className="text-sm font-medium">
              {showAnswers ? "Hide Answers" : "Show Answers"}
            </span> */}
          </button>
          <div className="flex items-center gap-4 text-2xl">
            <button
              onClick={() => setFontSize((prev) => Math.max(0.8, prev - 0.1))}
              className="
         cursor-pointer
    "
            >
              <span className=" text-white hover:text-orange-500 transition">
                A-{" "}
              </span>
            </button>
            <button
              onClick={() => setFontSize((prev) => Math.min(3, prev + 0.1))}
              className="           
            cursor-pointer
             "
            >
              <span className="  text-white hover:text-orange-500 transition">
                {" "}
                A+
              </span>
            </button>
          </div>
          <div className="w-px h-14 bg-slate-300"></div>
          <button
            className="
            p-1.5 rounded-lg
            text-slate-600
     
            cursor-pointer"
            onClick={onClose}
          >
            <BsArrowsAngleContract
              size={22}
              className="text-white hover:text-orange-500 transition"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presentation;
