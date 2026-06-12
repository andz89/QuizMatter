"use client";

import { useState, useEffect, useRef } from "react";
import QuizDetails from "./QuizDetails";
import QuestionInput from "./QuestionInput";
import LayoutOptions from "./LayoutOptions";
import MultipleChoicesInput from "./MultipleChoicesInput";
import FillTheBlankInput from "./FillTheBlankInput";

import QuestionHeader from "./QuestionHeader";
import { useQuizStore } from "./store/QuizStore";
import { DndContext, closestCenter } from "@dnd-kit/core";
import toast from "react-hot-toast";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { BsArrowsAngleExpand } from "react-icons/bs";
import PublishSettingsModal from "../../../components/modal/PublishSettingsModal";
import { useSaveQuiz } from "./utils/useSaveQuiz";
import EditQuizDetails from "./EditQuizDetails";
import Presentation from "@/src/components/presentation/Presentation";
import FloatingToolbar from "./editor/FloatingToolbar";
const isQuestion = (type) => ["multiple", "short"].includes(type);

function addQuestionNumbers(items) {
  let questionNumber = 0;

  return items.map((item) => {
    if (isQuestion(item.type)) {
      questionNumber++;

      return {
        ...item,
        questionNumber,
      };
    }

    return item;
  });
}
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
    options,
    updateQuestionLabelVisibility,
    setDetails,
    deletedQuestions,
    deletedOptions,
    addOption,
    addQuestionAfter,
    removeOption,
  } = useQuizStore();

  //show delete icon to delete option when focus
  const [deleteOptionId, setDeleteOptionId] = useState({});
  const [activeEditor, setActiveEditor] = useState(null); //tiny
  const [openMenuBelow, setOpenMenuBelow] = useState(false);
  const { handleSave, sending, error } = useSaveQuiz();
  const [openMenu, setOpenMenu] = useState(null);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [mode, setMode] = useState(null);

  const [manualSave, setManualSave] = useState(false);
  const [quizDetails, setQuizDetails] = useState(quiz);
  const [openEdit, setOpenEdit] = useState(false);
  //  compute dirty state (for UI only)
  const dirtyQuestions = questions.filter((q) => q.isDirty);
  const dirtyOptions = options.filter((o) => o.isDirty);

  const isDirty =
    dirtyQuestions.length > 0 ||
    dirtyOptions.length > 0 ||
    deletedQuestions.length > 0 ||
    deletedOptions.length > 0;

  const saveRef = useRef(handleSave);
  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);
  useEffect(() => {
    if (!error?.message) return;

    toast.error(error.message);
  }, [error]);
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
    setDetails({
      quizId: currentQuiz.id,
    });
    if (currentQuiz.questions.length > 0) {
      const { questions, options } = normalizeSingleQuiz(currentQuiz);

      useQuizStore.setState({
        questions,
        options,
      });
    }
  }, [quiz]);

  const handlePublish = (settings) => {
    console.log("Publishing with settings:", settings);

    // call your API here
  };
  const presentationQuiz = {
    ...quizDetails,

    questions: questions.map((question) => ({
      ...question,

      options: options
        .filter((opt) => opt.question_id === question.question_id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    })),
  };
  // if you want to remove this, replace the itemsWithNumbers before map with questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const itemsWithNumbers = addQuestionNumbers(
    questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  );
  return (
    <div className="bg-white min-h-screen mb-40">
      {/* quiz header */}
      <PublishSettingsModal
        isOpen={openPublishModal}
        onClose={() => setOpenPublishModal(false)}
        onPublish={handlePublish}
      />
      <Presentation
        quiz={presentationQuiz}
        open={mode === "present"}
        onClose={() => setMode("view")}
      />
      <div className="fixed top-0 py-2 bg-gray-50 z-51 flex items-center justify-between border-b border-gray-200 w-full px-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            <span className="text-slate-800">Quiz </span>
            <span className="text-orange-400">Matter</span>
          </h1>
        </div>

        {/* Center */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <FloatingToolbar editor={activeEditor} />
        </div>
        <div className="  flex items-center gap-3">
          <button
            onClick={() => {
              setMode("present");
            }}
            className="
          mx-2
          cursor-pointer
        "
          >
            <BsArrowsAngleExpand
              size={22}
              className="text-2xl text-slate-800 hover:text-orange-500 transition  "
            />
          </button>

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
                  : "bg-slate-900 text-white cursor-pointer"
            }`}
          >
            Save
          </button>

          <button
            onClick={() => setOpenPublishModal(true)}
            className={`cursor-pointer px-4 py-2 rounded shadow-sm bg-orange-500 text-white `}
          >
            Share
          </button>
        </div>
      </div>
      {/* quiz header end */}

      <div className="max-w-[720px] mx-auto    ">
        <div className="flex flex-col pt-20">
          {/* Quiz Details */}
          <QuizDetails setOpenEdit={setOpenEdit} quiz={quizDetails} />
          <EditQuizDetails
            details={quizDetails}
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            setQuizDetails={setQuizDetails}
          />
          {/* Questions details end */}

          {itemsWithNumbers.map((q, index) => {
            return (
              <div key={q.question_id} className="  ">
                <div className="flex items-center justify-end gap-3  w-full mt-4 mb-1">
                  <QuestionHeader
                    questionLength={questions.length}
                    questionId={q.question_id}
                    setOpenMenu={setOpenMenu}
                    openMenu={openMenu}
                    isActive={openMenu === q.question_id}
                    activeRef={activeRef}
                  />
                </div>
                <div className="flex flex-col gap-4 p-2 border border-gray-200 rounded w-full">
                  {/* Question */}
                  {/* {q.type !== "para" && ( */}
                  <QuestionInput
                    id={q.question_id}
                    index={q.questionNumber}
                    setActiveEditor={setActiveEditor}
                  />
                  {/* )} */}
                  {/* {q.type === "para" && (
                      <QuestionInput
                        id={q.question_id}
                        setActiveEditor={setActiveEditor}
                      />
                    )} */}
                  {/* Layout */}
                  {q.type === "multiple" && (
                    <div className=" flex justify-between">
                      <LayoutOptions id={q.question_id} layoutData={q.layout} />
                    </div>
                  )}

                  {/* Fill in the blank */}
                  {q.type === "short" && (
                    <FillTheBlankInput
                      question_id={q.question_id}
                      setActiveEditor={setActiveEditor}
                    />
                  )}

                  {/* Multiple Choice */}
                  {q.type === "multiple" && (
                    <div
                      className={`gap-2    ${
                        q.layout === "row"
                          ? "flex flex-row flex-wrap  min-w-10"
                          : q.layout === "grid"
                            ? "grid grid-cols-2 w-full"
                            : "flex flex-col flex-base"
                      }`}
                    >
                      {q.type === "multiple" &&
                        (() => {
                          // ✅ always sort before render
                          const questionOptions = options
                            .filter((opt) => opt.question_id === q.question_id)
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
                                items={questionOptions.map((o) => o.option_id)}
                                strategy={verticalListSortingStrategy}
                              >
                                {questionOptions.map((opt, index) => (
                                  <MultipleChoicesInput
                                    setDeleteOptionId={setDeleteOptionId}
                                    showLabel={q.showLabel}
                                    key={opt.option_id}
                                    opt={opt}
                                    index={index}
                                    deleteOptionId={deleteOptionId}
                                    setActiveEditor={setActiveEditor}
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

                  {q.type === "multiple" && (
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
  peer-checked:bg-orange-500

  after:content-[''] after:absolute after:top-[1px] after:left-[1px]
  after:bg-white after:border after:border-gray-300
  after:rounded-full after:h-3 after:w-3
  after:transition-all after:duration-300

  peer-checked:after:translate-x-[16px]
  peer-checked:after:border-orange-500
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

                <button
                  onClick={() => {
                    addQuestionAfter(null, "textbox");
                    setOpenMenuBelow(false);
                  }}
                  className="w-full text-left px-3 py-1 text-md hover:bg-gray-100"
                >
                  Text Box
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
