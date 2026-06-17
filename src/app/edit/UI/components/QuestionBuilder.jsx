"use client";
import Header from "./Header";
import addQuestionNumbers from "@/src/app/utils/lib/addQuestionNumbers";
import { useState, useEffect, useRef, useMemo } from "react";
import QuestionContent from "./QuestionContent";
import QuizDetails from "./QuizDetails";
import QuizTypeOptions from "./questionContent/QuizTypeOptions";
import { useQuizStore } from "../store/QuizStore";
import DragOptions from "./questionContent/dndkit/DragOptions";
import normalizeSingleQuiz from "@/src/app/utils/lib/normalizeSingleQuiz";

import FloatingToolbar from "../editor/FloatingToolbar";

export default function QuestionBuilder({ quiz }) {
  const questions = useQuizStore((s) => s.questions);
  const options = useQuizStore((s) => s.options);
  const deletedQuestions = useQuizStore((s) => s.deletedQuestions);
  const deletedOptions = useQuizStore((s) => s.deletedOptions);
  const setDetails = useQuizStore((s) => s.setDetails);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeEditor, setActiveEditor] = useState(null); //tiny editor, to activate tiny editor toolbar in input
  // custom hook to save quiz, it returns handleSave function, sending state and error state

  const [openMenu, setOpenMenu] = useState(null); // this is for question menu, when click add button on question header, it will show question type options, openMenu state will store the question id of the open menu, if null then no menu is open

  const [mode, setMode] = useState(null); // view, edit, present state  modal state
  const [manualSave, setManualSave] = useState(false); // to show toast only when save button is clicked, not on autosave

  //  compute dirty state (for UI only)
  const dirtyQuestions = questions.filter((q) => q.isDirty);
  const dirtyOptions = options.filter((o) => o.isDirty);

  const isDirty = // if any question or option is dirty or any question or option is deleted, then the quiz is dirty
    dirtyQuestions.length > 0 ||
    dirtyOptions.length > 0 ||
    deletedQuestions.length > 0 ||
    deletedOptions.length > 0;

  const activeRef = useRef(null); // to detect click outside of question menu and close the menu when click outside

  useEffect(() => {
    // click outside to close  quiz type menu
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

  useEffect(() => {
    if (!quiz) return;
    // normalize or arrange and set quiz details in store when quiz prop changes
    const currentQuiz = {
      ...quiz,
      questions: [...(quiz.questions || [])]
        .sort((a, b) => a.order - b.order)
        .map((question) => ({
          ...question,
          options: [...(question.options || [])].sort(
            (a, b) => a.order - b.order,
          ),
        })),
    };

    setDetails({
      quizId: currentQuiz.id,
      title: currentQuiz.title,
      subject: currentQuiz.subject,
      quarter: currentQuiz.quarter,
      grade: currentQuiz.grade,
      objectives: currentQuiz.objectives,
    });

    if (currentQuiz.questions.length > 0) {
      const { questions, options } = normalizeSingleQuiz(currentQuiz);

      useQuizStore.setState({
        questions,
        options,
      });
    }
  }, [quiz]);

  const itemsWithNumbers = useMemo(() => {
    return addQuestionNumbers(
      questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    );
  }, [questions]);

  return (
    <div className="  min-h-screen ">
      {/* header */}
      <Header
        activeEditor={activeEditor}
        setManualSave={setManualSave}
        isDirty={isDirty}
        setMode={setMode}
        questions={questions}
        mode={mode}
        options={options}
      />
      {/* quiz header end */}

      <div className="max-w-[720px] mx-auto   p-2 ">
        <div className="flex flex-col pt-20">
          {/* Quiz Details */}
          <QuizDetails />

          {/* Questions details end */}

          <DragOptions lists={itemsWithNumbers} type={"question"}>
            {itemsWithNumbers.map((q) => (
              <QuestionContent
                key={q.question_id}
                q={q}
                setActiveQuestion={setActiveQuestion}
                activeQuestion={activeQuestion}
                setActiveEditor={setActiveEditor}
                setOpenMenu={setOpenMenu}
                openMenu={openMenu}
                activeRef={activeRef}
              />
            ))}
          </DragOptions>

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

          {/* footer */}
        </div>
      </div>
    </div>
  );
}
