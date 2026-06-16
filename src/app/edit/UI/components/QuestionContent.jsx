import React from "react";
import QuestionInput from "./questionContent/QuestionInput";

import FillTheBlankInput from "./questionContent/FillTheBlankInput";

import Textbox from "./questionContent/TextBox";
import OptionsReference from "./questionContent/OptionsReference";
import QuestionOptions from "./questionContent/QuestionOptions";
import { useQuizStore } from "../store/QuizStore";
import QuizTypeOptions from "./questionContent/QuizTypeOptions";
import MultipleChoicesContent from "./questionContent/MultipleChoicesContent";

const QuestionContent = ({
  setActiveQuestion,
  activeQuestion,
  q,
  setActiveEditor,
  setOpenMenu,
  openMenu,
  activeRef,
}) => {
  const questions = useQuizStore((s) => s.questions);

  return (
    <div onClick={() => setActiveQuestion(q.question_id)}>
      <div
        className={`bg-white flex   w-full justify-center my-4   rounded-lg transition-all duration-300 ease-out shadow-sm
    ${
      activeQuestion === q.question_id
        ? "border-l-3  border-orange-500  "
        : "border-l-3  border-gray-200 "
    }
    `}
      >
        <div className="flex flex-col gap-4 p-2 border border-gray-200 rounded-lg w-full min-h-[200px]">
          {/* Question */}

          {["multiple", "short"].includes(q.type) && (
            <QuestionInput
              id={q.question_id}
              index={q.questionNumber}
              setActiveEditor={setActiveEditor}
            />
          )}
          {q.type === "textbox" && (
            <Textbox setActiveEditor={setActiveEditor} q={q} />
          )}

          {/* Layout */}

          <OptionsReference q={q} />

          {/* Fill in the blank */}

          <FillTheBlankInput q={q} setActiveEditor={setActiveEditor} />

          {/* Multiple Choice */}
          <MultipleChoicesContent q={q} setActiveEditor={setActiveEditor} />

          {/* //options reference */}
        </div>

        <div
          className={`
                          relative flex items-center justify-end gap-3
                          transition-all duration-300 ease-out
                          ${
                            activeQuestion === q.question_id
                              ? "opacity-100  "
                              : "opacity-0   pointer-events-none"
                          }
                          `}
        >
          <div className="absolute left-[5px]">
            <QuestionOptions
              questionLength={questions.length}
              questionId={q.question_id}
            />
          </div>
        </div>
      </div>

      {/* add question button */}
      <div className="mt-5 w-full relative mx-auto">
        <QuizTypeOptions
          questionId={q.question_id}
          setOpenMenu={setOpenMenu}
          isActive={openMenu === q.question_id}
          activeRef={activeRef}
        />
      </div>
    </div>
  );
};

export default QuestionContent;
