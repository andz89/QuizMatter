"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QuizDetails from "./QuizDetails";
import QuestionInput from "./QuestionInput";
import LayoutOptions from "./LayoutOptions";
import MultipleChoicesInput from "./MultipleChoicesInput";
import FillTheBlankInput from "./FillTheBlankInput";
import QuestionFooter from "./QuestionFooter";
import { useQuizStore } from "../../store/QuizStore";
import { useDebounce } from "../../hooks/useDebounce";
export default function QuestionBuilder({ quiz }) {
  const [openMenu, setOpenMenu] = useState(null);

  const { questions, addQuestion, options, clearDirty, setDetails, details } =
    useQuizStore();

  const [sending, setSending] = useState(false);
  const isSavingRef = useRef(false);

  // ✅ compute dirty state (for UI only)
  const dirtyQuestions = questions.filter((q) => q.isDirty);
  const dirtyOptions = options.filter((o) => o.isDirty);
  const dirtyDetails = details?.isDirty;

  const isDirty =
    dirtyQuestions.length > 0 || dirtyOptions.length > 0 || dirtyDetails;

  // ✅ MAIN SAVE FUNCTION (no stale data)
  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;
    if (!details?.quizId) return;

    // 🔥 recompute INSIDE (avoid stale closure)
    const dirtyQuestions = questions.filter((q) => q.isDirty);
    const dirtyOptions = options.filter((o) => o.isDirty);
    const dirtyDetails = details?.isDirty;
    console.log("Auto-saving checking dirty state...");
    if (
      dirtyQuestions.length === 0 &&
      dirtyOptions.length === 0 &&
      !dirtyDetails
    )
      return;

    isSavingRef.current = true;
    setSending(true);

    const questionPayload = dirtyQuestions.map((q) => {
      const fields = Object.keys(q.dirtyFields || {});
      const updatedFields = fields.reduce((acc, key) => {
        acc[key] = q[key];
        return acc;
      }, {});
      return {
        quizId: details.quizId,
        id: q.id,
        ...updatedFields,
      };
    });

    const optionPayload = dirtyOptions.map((o) => {
      const fields = Object.keys(o.dirtyFields || {});
      const updatedFields = fields.reduce((acc, key) => {
        acc[key] = o[key];
        return acc;
      }, {});
      return {
        id: o.id,
        ...updatedFields,
      };
    });

    const detailsPayload = dirtyDetails
      ? {
          id: details.quizId,
          ...Object.fromEntries(
            Object.keys(details.dirtyFields || {}).map((k) => [k, details[k]]),
          ),
        }
      : null;

    console.log("Saving...", {
      questions: questionPayload,
      options: optionPayload,
      details: detailsPayload,
    });

    // ✅ simulate API delay (better than setTimeout)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearDirty({
      questions: dirtyQuestions.map((q) => ({
        id: q.id,
        fields: Object.keys(q.dirtyFields || {}),
      })),
      options: dirtyOptions.map((o) => ({
        id: o.id,
        fields: Object.keys(o.dirtyFields || {}),
      })),
      details: dirtyDetails ? Object.keys(details.dirtyFields || {}) : [],
    });

    isSavingRef.current = false;
    setSending(false);
  }, [questions, options, details, clearDirty]);
  // ✅ NOW define ref AFTER
  const saveRef = useRef(handleSave);
  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);

  // ✅ INTERVAL AUTOSAVE (stable, no reset)
  useEffect(() => {
    const interval = setInterval(() => {
      saveRef.current(); // always latest, but interval never resets
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!quiz) return; // guard

    if (questions.length === 0) {
      addQuestion();
    }

    setDetails({
      quizId: quiz.id,
      title: quiz.title || "",
      description: quiz.description || "",
      grade: quiz.grade || "",
      subject: quiz.subject || "",
      quarter: quiz.quarter || "",
      objectives: quiz.objectives || "",
    });
  }, [quiz]);
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[720px] mx-auto py-10 mb-20">
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleSave}
            disabled={sending || !isDirty}
            className={`px-4 py-2 rounded shadow-lg ${
              sending
                ? "bg-gray-400"
                : !isDirty
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white"
            }`}
          >
            {sending ? "Saving..." : "Save"}
          </button>
        </div>
        <div className="flex flex-col">
          {/* Quiz Details */}
          <QuizDetails quiz={quiz} />

          {/* Questions */}

          {questions?.map((q, index) => {
            const questionOptions = options.filter(
              (opt) => opt.questionId === q.id,
            );

            return (
              <div key={q.id} className="p-6 border border-gray-200">
                <div className="flex flex-col gap-4">
                  {/* Question */}
                  <QuestionInput id={q.id} order={index} />
                  {/* Layout */}
                  {q.type !== "short" && (
                    <LayoutOptions id={q.id} layoutData={q.layout} />
                  )}

                  {/* Fill in the blank */}
                  {q.type === "short" && <FillTheBlankInput index={index} />}
                  {/* Multiple Choice */}
                  {q.type !== "short" && (
                    <div
                      className={`gap-2 ${
                        q.layout === "row"
                          ? "flex flex-row flex-wrap justify-around"
                          : q.layout === "grid"
                            ? "grid grid-cols-2"
                            : "flex flex-col"
                      }`}
                    >
                      {questionOptions.map((opt) => (
                        <MultipleChoicesInput key={opt.id} opt={opt} />
                      ))}

                      {/* Footer */}
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-3 mt-5 w-full">
                    <QuestionFooter
                      questionId={q.id}
                      setOpenMenu={setOpenMenu}
                      openMenu={openMenu}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
