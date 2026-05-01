"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QuizDetails from "./QuizDetails";
import QuestionInput from "./QuestionInput";
import LayoutOptions from "./LayoutOptions";
import MultipleChoicesInput from "./MultipleChoicesInput";
import FillTheBlankInput from "./FillTheBlankInput";
import QuestionFooter from "./QuestionFooter";
import { useQuizStore } from "../../store/QuizStore";
import { DndContext, closestCenter } from "@dnd-kit/core";

import QuizTypeOptions from "./QuizTypeOptions";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import ErrorModal from "../modal/ErrorModal";
import PublishSettingsModal from "../modal/PublishSettingsModal";
import { useSaveQuiz } from "../hooks/useSaveQuiz";
function normalizeSingleQuiz(quiz) {
  const questions = [];
  const options = [];

  quiz.questions?.forEach((q) => {
    questions.push({
      ...q,
      isDirty: false,
    });

    q.options?.forEach((opt) => {
      options.push({
        ...opt,
        showLabel: q.showLabel ?? true, // ✅ fallback
        question_id: q.question_id,
        isDirty: false,
      });
    });
  });

  return { questions, options };
}
export default function QuestionBuilder({ quiz }) {
  const {
    questions,
    addQuestion,
    options,
    updateQuestionLabelVisibility,
    setDetails,
    details,
    deletedQuestions,
    deletedOptions,
    addOption,
    addQuestionAfter,
  } = useQuizStore();
  const [openMenuBelow, setOpenMenuBelow] = useState(false);
  const { handleSave, sending, error, setError } = useSaveQuiz();
  const [openMenu, setOpenMenu] = useState(null);
  const [openPublishModal, setOpenPublishModal] = useState(false);

  const [manualSave, setManualSave] = useState(false);

  //  compute dirty state (for UI only)
  const dirtyQuestions = questions.filter((q) => q.isDirty);
  const dirtyOptions = options.filter((o) => o.isDirty);
  const dirtyDetails = details?.isDirty;

  const isDirty =
    dirtyQuestions.length > 0 ||
    dirtyOptions.length > 0 ||
    dirtyDetails ||
    deletedQuestions.length > 0 ||
    deletedOptions.length > 0;

  const saveRef = useRef(handleSave);
  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);

  //  INTERVAL AUTOSAVE (stable, no reset)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     saveRef.current(); // always latest, but interval never resets
  //   }, 15000);
  //   if (!isDirty) return; // if not dirty, don't set interval
  //   return () => clearInterval(interval);
  // }, []);

  const activeRef = useRef(null);
  const belowMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // existing menu
      if (activeRef.current && !activeRef.current.contains(event.target)) {
        setOpenMenu(null);
      }

      // ✅ NEW: below menu
      if (
        belowMenuRef.current &&
        !belowMenuRef.current.contains(event.target)
      ) {
        setOpenMenuBelow(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (!quiz || quiz.length === 0) return;

    const currentQuiz = quiz;

    if (currentQuiz.questions.length > 0) {
      const { questions, options } = normalizeSingleQuiz(currentQuiz);

      useQuizStore.setState({
        questions,
        options,
      });
    }

    setDetails({
      quizId: currentQuiz.id,
      title: currentQuiz.title || "",
      description: currentQuiz.description || "",
      grade: currentQuiz.grade || "",
      subject: currentQuiz.subject || "",
      quarter: currentQuiz.quarter || "",
      objectives: currentQuiz.objectives || "",
    });

    // if (currentQuiz.questions.length === 0) {
    //   // only add question if DB has none
    //   addQuestion();
    // }
  }, [quiz]);
  const handlePublish = (settings) => {
    console.log("Publishing with settings:", settings);

    // call your API here
  };
  return (
    <div className="bg-white min-h-screen mb-40">
      {/* quiz header */}
      <div className="fixed top-0   py-2 bg-gray-50 z-10 flex items-center gap-4 w-full justify-end px-6 border-b border-gray-200 ">
        <div className="">
          <span
            className={`px-4 py-2 rounded   ${
              sending ? "bg-yellow-100 text-yellow-800 " : "opacity-0"
            }`}
          >
            {manualSave ? "Saving..." : "Auto saving..."}
          </span>
        </div>
        <ErrorModal
          isOpen={!!error}
          onClose={() => setError(null)}
          title="Save Failed"
          message={error?.message}
          type={error?.type}
        />
        <button
          onClick={() => {
            setManualSave(true);
            handleSave();
          }}
          disabled={sending || !isDirty}
          className={`px-4 py-2 rounded shadow-sm ${
            sending
              ? "bg-gray-400"
              : !isDirty
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white cursor-pointer"
          }`}
        >
          Save
        </button>
        <PublishSettingsModal
          isOpen={openPublishModal}
          onClose={() => setOpenPublishModal(false)}
          onPublish={handlePublish}
        />
        <button
          onClick={() => setOpenPublishModal(true)}
          className={`cursor-pointer px-4 py-2 rounded shadow-sm bg-green-700 text-white `}
        >
          Publish
        </button>
      </div>
      {/* quiz header end */}

      <div className="max-w-[720px] mx-auto    ">
        <div className="flex flex-col pt-20">
          {/* Quiz Details */}
          <QuizDetails quiz={quiz} />

          {/* Questions details end */}

          {questions
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((q, index) => {
              const questionOptions = options
                .filter((opt) => opt.question_id === q.question_id)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

              return (
                <div key={q.question_id} className="  ">
                  <div className="flex items-center justify-end gap-3  w-full mt-7 mb-1">
                    <QuestionFooter
                      questionLength={questions.length}
                      questionId={q.question_id}
                      setOpenMenu={setOpenMenu}
                      openMenu={openMenu}
                      isActive={openMenu === q.question_id}
                      activeRef={activeRef}
                      index={q.order}
                    />
                  </div>
                  <div className="flex flex-col gap-4 p-2 border border-gray-200 rounded">
                    {/* Question */}

                    <QuestionInput id={q.question_id} index={index} />
                    {/* Layout */}
                    {q.type !== "short" && (
                      <LayoutOptions id={q.question_id} layoutData={q.layout} />
                    )}

                    {/* Fill in the blank */}
                    {q.type === "short" && (
                      <FillTheBlankInput index={q.order} />
                    )}
                    {/* Multiple Choice */}
                    {q.type !== "short" && (
                      <div
                        className={`gap-2    ${
                          q.layout === "row"
                            ? "flex flex-row flex-wrap justify-around"
                            : q.layout === "grid"
                              ? "grid grid-cols-2 w-full"
                              : "flex flex-col flex-base"
                        }`}
                      >
                        {q.type !== "short" &&
                          (() => {
                            // ✅ always sort before render
                            const questionOptions = options
                              .filter(
                                (opt) => opt.question_id === q.question_id,
                              )
                              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                            return (
                              <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => {
                                  const { active, over } = event;

                                  if (!over || active.id === over.id) return;

                                  const oldIndex = questionOptions.findIndex(
                                    (o) => o.option_id === active.id,
                                  );

                                  const newIndex = questionOptions.findIndex(
                                    (o) => o.option_id === over.id,
                                  );

                                  const newItems = arrayMove(
                                    questionOptions,
                                    oldIndex,
                                    newIndex,
                                  );

                                  // ✅ build fast lookup map
                                  const orderMap = new Map(
                                    newItems.map((item, index) => [
                                      item.option_id,
                                      index,
                                    ]),
                                  );

                                  // ✅ update ONLY this question’s options
                                  useQuizStore.setState((state) => ({
                                    options: state.options.map((opt) => {
                                      if (opt.question_id !== q.question_id)
                                        return opt;

                                      const newOrder = orderMap.get(
                                        opt.option_id,
                                      );

                                      // optional: avoid unnecessary updates
                                      if (
                                        newOrder === undefined ||
                                        newOrder === opt.order
                                      )
                                        return opt;

                                      return {
                                        ...opt,
                                        order: newOrder,
                                        isDirty: true,
                                        dirtyFields: {
                                          ...(opt.dirtyFields || {}),
                                          order: true, // ✅ correct
                                        },
                                      };
                                    }),
                                  }));
                                }}
                              >
                                <SortableContext
                                  items={questionOptions.map(
                                    (o) => o.option_id,
                                  )}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {questionOptions.map((opt, index) => (
                                    <MultipleChoicesInput
                                      showLabel={q.showLabel}
                                      key={opt.option_id}
                                      opt={opt}
                                      index={index}
                                      questionOptionsLength={
                                        questionOptions.length
                                      }
                                    />
                                  ))}
                                </SortableContext>
                              </DndContext>
                            );
                          })()}

                        {/* Footer */}
                      </div>
                    )}

                    {q.type !== "short" && (
                      <div className="flex items-center justify-start gap-2 w-full">
                        <div className="flex items-center justify-between gap-2 w-[70px]">
                          <label className="text-sm font-medium text-gray-700">
                            Label
                          </label>

                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={q.showLabel ?? true}
                              onChange={(e) =>
                                updateQuestionLabelVisibility(
                                  q.question_id,
                                  e.target.checked,
                                )
                              }
                              className="sr-only peer"
                            />

                            <div
                              className="w-[30px] h-[14px] bg-gray-300 rounded-full relative
  transition-colors duration-300
  peer-checked:bg-green-500

  after:content-[''] after:absolute after:top-[1px] after:left-[1px]
  after:bg-white after:border after:border-gray-300
  after:rounded-full after:h-3 after:w-3
  after:transition-all after:duration-300

  peer-checked:after:translate-x-[16px]
  peer-checked:after:border-green-500
  peer-checked:shadow-sm
"
                            ></div>
                          </label>
                        </div>

                        <button
                          onClick={() => addOption(q.question_id)}
                          className="ml-2 px-2 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition w-32"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          <div ref={belowMenuRef} className="mt-5 w-full relative">
            <div
              onClick={() => setOpenMenuBelow((prev) => !prev)}
              className="user-select-none w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded cursor-pointer transition"
            >
              Add Question Below
            </div>

            {openMenuBelow && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-2">
                <button
                  onClick={() => {
                    addQuestionAfter(null, "multiple");
                    setOpenMenuBelow(false);
                  }}
                  className="w-full text-left px-3 py-1 text-md hover:bg-gray-100"
                >
                  Multiple Choice
                </button>

                <button
                  onClick={() => {
                    addQuestionAfter(null, "short");
                    setOpenMenuBelow(false);
                  }}
                  className="w-full text-left px-3 py-1 text-md hover:bg-gray-100"
                >
                  Fill in the Blank
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
