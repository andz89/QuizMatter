"use client";
import Image from "next/image";
import addQuestionNumbers from "@/src/app/utils/lib/addQuestionNumbers";
import { useState, useEffect, useRef, useMemo } from "react";
import QuizDetails from "./QuizDetails";
import QuestionInput from "./QuestionInput";
import LayoutOptions from "./LayoutOptions";
import MultipleChoicesInput from "./MultipleChoicesInput";
import FillTheBlankInput from "./FillTheBlankInput";
import QuizTypeOptions from "./QuizTypeOptions";
import QuestionHeader from "./QuestionHeader";
import { useQuizStore } from "./store/QuizStore";
import toast from "react-hot-toast";
import DragOptions from "./DragOptions";

import { BsArrowsAngleExpand } from "react-icons/bs";
import PublishSettingsModal from "../../../components/modal/PublishSettingsModal";
import { useSaveQuiz } from "./utils/useSaveQuiz";
import EditQuizDetails from "./EditQuizDetails";
import Presentation from "@/src/components/presentation/Presentation";
import FloatingToolbar from "./editor/FloatingToolbar";
import normalizeSingleQuiz from "@/src/app/utils/lib/normalizeSingleQuiz";

export default function QuestionBuilder({ quiz }) {
  console.log("QuestionBuilder render");
  const questions = useQuizStore((s) => s.questions);
  const options = useQuizStore((s) => s.options);
  const deletedQuestions = useQuizStore((s) => s.deletedQuestions);
  const deletedOptions = useQuizStore((s) => s.deletedOptions);

  const updateQuestionLabelVisibility = useQuizStore(
    (s) => s.updateQuestionLabelVisibility,
  );

  const setDetails = useQuizStore((s) => s.setDetails);

  const addOption = useQuizStore((s) => s.addOption);

  const [activeEditor, setActiveEditor] = useState(null); //tiny editor, to activate tiny editor toolbar in input
  const [openMenuBelow, setOpenMenuBelow] = useState(false); // show question type options when click add question below button
  const { handleSave, sending, error } = useSaveQuiz(); // custom hook to save quiz, it returns handleSave function, sending state and error state
  const [openMenu, setOpenMenu] = useState(null); // this is for question menu, when click add button on question header, it will show question type options, openMenu state will store the question id of the open menu, if null then no menu is open
  const [openPublishModal, setOpenPublishModal] = useState(false); // publish modal state

  const [mode, setMode] = useState(null); // view, edit, present state  modal state
  const [manualSave, setManualSave] = useState(false); // to show toast only when save button is clicked, not on autosave
  const [quizDetails, setQuizDetails] = useState(quiz); // quiz details state, it will store the quiz details like title, description etc, it will be passed to quiz details component and edit quiz details component

  const [openEdit, setOpenEdit] = useState(false); // edit quiz details modal state, when click on quiz details it will open the modal to edit quiz details like title, description etc

  //  compute dirty state (for UI only)
  const dirtyQuestions = questions.filter((q) => q.isDirty);
  const dirtyOptions = options.filter((o) => o.isDirty);

  const isDirty = // if any question or option is dirty or any question or option is deleted, then the quiz is dirty
    dirtyQuestions.length > 0 ||
    dirtyOptions.length > 0 ||
    deletedQuestions.length > 0 ||
    deletedOptions.length > 0;

  const saveRef = useRef(handleSave); // to always have the latest handleSave function in the interval, without resetting the interval
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

  const activeRef = useRef(null); // to detect click outside of question menu and close the menu when click outside

  useEffect(() => {
    // click outside to close menu
    const handleClickOutside = (event) => {
      // existing menu
      if (activeRef.current && !activeRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const activeQuestionRef = useRef(null);

  const [activeQuestion, setActiveQuestion] = useState(null);
  useEffect(() => {
    // click outside to close menu
    const handleHoverQuestion = (event) => {
      // existing menu
      if (!activeQuestionRef.current) {
        setActiveQuestion(null);
      }
    };

    document.addEventListener("hover", handleHoverQuestion);

    return () => {
      document.removeEventListener("hover", handleHoverQuestion);
    };
  }, []);
  useEffect(() => {
    // normalize and set quiz details in store when quiz prop changes
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

  // publish handler, for now it just logs the settings, you can replace it with your API call to publish the quiz
  const handlePublish = (settings) => {
    console.log("Publishing with settings:", settings);

    // call   API here
  };

  const presentationQuiz = {
    // prepare quiz data for presentation component, you can optimize this by memoizing it or preparing the data in the store when setting the quiz details
    ...quizDetails,

    questions: questions.map((question) => ({
      ...question,

      options: options
        .filter((opt) => opt.question_id === question.question_id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    })),
  };
  // if you want to remove this, replace the itemsWithNumbers before map with questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  // const itemsWithNumbers = addQuestionNumbers(
  //   questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  // );
  const itemsWithNumbers = useMemo(() => {
    return addQuestionNumbers(
      questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    );
  }, [questions]);
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
          <Image
            src="/quizmatter-logo.png"
            alt="School Logo"
            width={120}
            height={120}
            className="object-contain"
          />
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

      <div className="max-w-[720px] mx-auto   p-2 ">
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
              <div
                onClick={() => setActiveQuestion(q.question_id)}
                key={q.question_id}
              >
                <div className="flex   w-full justify-center my-4">
                  <div className="flex flex-col gap-4 p-2 border border-gray-200 rounded-lg w-full min-h-[200px]">
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
                        <LayoutOptions
                          id={q.question_id}
                          layoutData={q.layout}
                        />
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
                              .filter(
                                (opt) => opt.question_id === q.question_id,
                              )
                              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                            return (
                              <>
                                <DragOptions
                                  questionId={q.question_id}
                                  questionOptions={questionOptions}
                                >
                                  {questionOptions.map((opt, index) => (
                                    <MultipleChoicesInput
                                      showLabel={q.showLabel}
                                      key={opt.option_id}
                                      opt={opt}
                                      index={index}
                                      setActiveEditor={setActiveEditor}
                                      questionOptionsLength={
                                        questionOptions.length
                                      }
                                      correctAnswer={q.correct}
                                    />
                                  ))}
                                </DragOptions>
                              </>
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
                            >
                              {" "}
                            </div>
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
                      <QuestionHeader
                        questionLength={questions.length}
                        questionId={q.question_id}
                      />
                    </div>
                  </div>
                </div>

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
          })}
          {itemsWithNumbers.length < 1 && (
            <div className="mt-5 w-full relative mx-auto">
              <QuizTypeOptions
                questionId={null}
                setOpenMenu={setOpenMenu}
                isActive={openMenu === "empty"}
                activeRef={activeRef}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
