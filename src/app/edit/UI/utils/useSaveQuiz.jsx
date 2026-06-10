"use client";
import { useCallback, useRef, useState } from "react";

import { useQuizStore } from "../store/QuizStore";
import { buildQuizPayload } from "./buildQuizPayload";
import toast from "react-hot-toast";

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
    throw new Error(data.error || "Failed to save");
  }

  return data;
};

export function useSaveQuiz() {
  const {
    questions,
    options,

    clearDirty,
    deletedQuestions,
    deletedOptions,
  } = useQuizStore();

  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const isSavingRef = useRef(false);

  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;

    const dirtyQuestions = questions.filter((q) => q.isDirty);
    const dirtyOptions = options.filter((o) => o.isDirty);

    if (
      dirtyQuestions.length === 0 &&
      dirtyOptions.length === 0 &&
      deletedQuestions.length === 0 &&
      deletedOptions.length === 0
    ) {
      return;
    }
    const saveToast = toast.loading("Saving...");
    try {
      isSavingRef.current = true;
      setSending(true);
      const payload = buildQuizPayload({
        questions,
        options,

        deletedQuestions,
        deletedOptions,
      });

      if (!payload) return;

      const {
        questions: questionPayload,
        options: optionPayload,

        dirtyQuestions,
        dirtyOptions,
      } = payload;

      console.log("Saving...", {
        questions: questionPayload,
        options: optionPayload,

        deletedQuestions,
        deletedOptions,
      });
      // SNAPSHOTS MUST BE CREATED BEFORE THE SAVE
      const deletedQuestionsSnapshot = [...deletedQuestions];
      const deletedOptionsSnapshot = [...deletedOptions];
      // simulate API
      await saveQuiz({
        questions: questionPayload,
        options: optionPayload,

        deletedQuestions,
        deletedOptions,
      });
      toast.success("Saved successfully", {
        id: saveToast,
      });
      //this is the original code, which only cleared the dirty fields, but we want to clear all dirty fields after a successful save
      // clearDirty({
      //   questions: dirtyQuestions.map((q) => ({
      //     question_id: q.question_id,
      //     fields: Object.keys(q.dirtyFields || {}),
      //   })),

      // this is the update code, which clears the dirty fields if no revision during saving
      clearDirty({
        questions: dirtyQuestions.map((q) => ({
          question_id: q.question_id,
          dirtyFields: { ...(q.dirtyFields || {}) },
        })),
        // options: dirtyOptions.map((o) => ({
        //   option_id: o.option_id,
        //   fields: Object.keys(o.dirtyFields || {}),
        // })),
        options: dirtyOptions.map((o) => ({
          option_id: o.option_id,
          dirtyFields: { ...(o.dirtyFields || {}) },
        })),

        deletedQuestions: deletedQuestionsSnapshot,
        deletedQuestions: deletedQuestionsSnapshot,
      });
    } catch (err) {
      setError({
        type: "network",
        message: err?.message || "Network error. Please check your internet.",
      });
      toast.error("Failed to save", {
        id: saveToast,
      });
    } finally {
      isSavingRef.current = false;
      setSending(false);
    }
  }, [questions, options, clearDirty, deletedQuestions, deletedOptions]);

  return {
    handleSave,
    sending,
    error,
    setError,
  };
}
