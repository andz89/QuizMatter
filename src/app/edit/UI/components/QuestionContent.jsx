import React from "react";
import QuestionInput from "./questionContent/QuestionInput";

import FillTheBlankInput from "./questionContent/FillTheBlankInput";

import Textbox from "./questionContent/TextBox";
import OptionsReference from "./questionContent/OptionsReference";
import {
  QuestionOptionsDesktop,
  QuestionOptionsMobile,
} from "./questionContent/SidePanelActions";
import { useQuizStore } from "../store/QuizStore";
import QuizTypeOptions from "./questionContent/QuizTypeOptions";
import MultipleChoicesContent from "./questionContent/MultipleChoicesContent";
import SortableElement from "./questionContent/dndkit/DragElement";

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
    <SortableElement id={q.question_id}>
      {({ attributes, listeners }) => (
        <div
          onPointerEnter={() => setActiveQuestion(q.question_id)}
          // onClick={() => setActiveQuestion(q.question_id)}

          className="mt-4"
        >
          <div className="block  md:hidden">
            <QuestionOptionsMobile
              questionLength={questions.length}
              questionId={q.question_id}
            />
          </div>
          <div
            className={`bg-white flex   w-full justify-center mb-2   rounded-lg transition-all duration-300 ease-out shadow-sm
    ${
      activeQuestion === q.question_id
        ? "border-l-3  border-orange-500  "
        : "border-l-3  border-gray-200 "
    }
    `}
          >
            <div className="flex flex-col gap-4 p-2 border border-gray-200 rounded-lg w-full min-h-[200px]">
              {/* Question */}
              {/* drag handle */}
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab hidden md:block"
              >
                ⋮⋮
              </button>
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
                          transition-all duration-300  ease-out
                          ${
                            activeQuestion === q.question_id
                              ? "opacity-100  "
                              : "opacity-0   pointer-events-none"
                          }
                          `}
            >
              <div className="absolute left-[5px]">
                <div className="hidden md:block">
                  <QuestionOptionsDesktop
                    questionLength={questions.length}
                    questionId={q.question_id}
                  />
                </div>
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
      )}
    </SortableElement>
  );
};

export default QuestionContent;
