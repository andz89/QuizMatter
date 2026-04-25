"use client";
import { useCallback, useRef, useState } from "react";

import { useQuizStore } from "../../store/QuizStore";
import { buildQuizPayload } from "../utils/buildQuizPayload";
const saveQuiz = async (payload) => {
  const res = await fetch("/api/saveQuiz", {
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
  const { questions, options, details, clearDirty, deletedQuestions } =
    useQuizStore();

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
      deletedQuestions.length === 0
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
      });

      // simulate API
      await saveQuiz({
        questions: questionPayload,
        options: optionPayload,
        details: detailsPayload,
        deletedQuestions,
      });

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
    } catch (err) {
      setError({
        type: "network",
        message: "Failed to save. Please try again.",
      });
    } finally {
      isSavingRef.current = false;
      setSending(false);
    }
  }, [questions, options, details, clearDirty, deletedQuestions]);

  return {
    handleSave,
    sending,
    error,
    setError,
  };
}
