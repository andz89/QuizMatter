"use client";
import { useCallback, useRef, useState } from "react";

import { useQuizStore } from "../store/QuizStore";
import { buildQuizPayload } from "./buildQuizPayload";

const saveQuiz = async (payload) => {
  const res = await fetch("/edit/api/saveQuiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Save quiz error:", data.error);
    throw new Error(data.error || "Failed to save");
  }

  return data;
};

export function useSaveQuiz() {
  const {
    questions,
    options,
    details,
    clearDirty,
    deletedQuestions,
    deletedOptions,
  } = useQuizStore();

  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const isSavingRef = useRef(false);

  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;
    if (!details?.quizId) return;

    const dirtyQuestions = questions.filter((q) => q.isDirty);
    const dirtyOptions = options.filter((o) => o.isDirty);
    const dirtyDetails = details?.isDirty;

    if (
      dirtyQuestions.length === 0 &&
      dirtyOptions.length === 0 &&
      !dirtyDetails &&
      deletedQuestions.length === 0 &&
      deletedOptions.length === 0
    ) {
      return;
    }

    try {
      isSavingRef.current = true;
      setSending(true);
      const payload = buildQuizPayload({
        questions,
        options,
        details,
        deletedQuestions,
        deletedOptions,
      });

      if (!payload) return;

      const {
        questions: questionPayload,
        options: optionPayload,
        details: detailsPayload,
        dirtyQuestions,
        dirtyOptions,
        dirtyDetails,
      } = payload;

      console.log("Saving...", {
        questions: questionPayload,
        options: optionPayload,
        details: detailsPayload,
        deletedQuestions,
        deletedOptions,
      });

      // simulate API
      await saveQuiz({
        questions: questionPayload,
        options: optionPayload,
        details: detailsPayload,
        deletedQuestions,
        deletedOptions,
      });

      clearDirty({
        questions: dirtyQuestions.map((q) => ({
          question_id: q.question_id,
          fields: Object.keys(q.dirtyFields || {}),
        })),
        options: dirtyOptions.map((o) => ({
          option_id: o.option_id,
          fields: Object.keys(o.dirtyFields || {}),
        })),
        details: dirtyDetails ? Object.keys(details.dirtyFields || {}) : [],
      });
    } catch (err) {
      setError({
        type: "network",
        message: "Failed to save. Please try again.",
      });
    } finally {
      isSavingRef.current = false;
      setSending(false);
    }
  }, [
    questions,
    options,
    details,
    clearDirty,
    deletedQuestions,
    deletedOptions,
  ]);

  return {
    handleSave,
    sending,
    error,
    setError,
  };
}
