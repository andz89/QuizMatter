// stores/quizStore.js
import { create } from "zustand";

const createEmptyQuestion = (type = "multiple") => ({
  id: Date.now(),
  question: "",
  type,
  layout: "col",
  correct: "",
  isDirty: true,
  isNew: true, // 👈 add this (important)

  dirtyFields: {
    question: true,
    type: true,
    layout: true,
    correct: true,
  },
});
const createOption = (questionId, label = "", value = "") => ({
  id: Date.now() + Math.random(),
  questionId,
  label,
  value,
  isDirty: true,
  isNew: true, // 👈 add this

  dirtyFields: {
    label: true,
    value: true,
    questionId: true,
  },
});

export const useQuizStore = create((set) => ({
  questions: [],
  options: [],
  deletedQuestions: [],
  details: {},

  setDetails: (details) => set({ details }),
  addQuestion: () =>
    set((state) => {
      const q = createEmptyQuestion("multiple");

      const newOptions = [
        createOption(q.id, "", "A"),
        createOption(q.id, "", "B"),
        createOption(q.id, "", "C"),
        createOption(q.id, "", "D"),
      ];

      return {
        questions: [...state.questions, q],
        options: [...state.options, ...newOptions],
      };
    }),
  updateDetails: (key, value) =>
    set((state) => ({
      details: {
        ...state.details,
        [key]: value,
        isDirty: true,
        dirtyFields: {
          ...(state.details.dirtyFields || {}),
          [key]: true,
        },
      },
    })),
  updateQuestion: (id, updatedQuestion) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id
          ? {
              ...q,
              ...updatedQuestion,
              isDirty: true,
              dirtyFields: {
                ...(q.dirtyFields || {}),
                ...Object.keys(updatedQuestion).reduce((acc, key) => {
                  acc[key] = true;
                  return acc;
                }, {}),
              },
            }
          : q,
      ),
    })),
  updateOption: (id, updatedOption) =>
    set((state) => ({
      options: state.options.map((opt) =>
        opt.id === id
          ? {
              ...opt,
              ...updatedOption,
              isDirty: true,
              dirtyFields: {
                ...(opt.dirtyFields || {}),
                ...Object.keys(updatedOption).reduce((acc, key) => {
                  acc[key] = true;
                  return acc;
                }, {}),
              },
            }
          : opt,
      ),
    })),
  removeQuestion: (index) =>
    set((state) => {
      const q = state.questions[index];

      return {
        questions: state.questions.filter((_, i) => i !== index),
        options: state.options.filter((opt) => opt.questionId !== q.id),
        deletedQuestions: [...state.deletedQuestions, q.id],
      };
    }),

  duplicateQuestion: (questionId) =>
    set((state) => {
      const index = state.questions.findIndex((q) => q.id === questionId);

      if (index === -1) return state;

      const q = state.questions[index];
      const newId = Date.now();

      const newQuestion = {
        ...q,
        id: newId,
        isDirty: true,
      };

      const newOptions = state.options
        .filter((opt) => opt.questionId === q.id)
        .map((opt) => ({
          ...opt,
          id: Date.now() + Math.random(),
          questionId: newId,
          isDirty: true,
        }));

      const newQuestions = [...state.questions];
      newQuestions.splice(index + 1, 0, newQuestion);

      return {
        questions: newQuestions,
        options: [...state.options, ...newOptions],
      };
    }),

  addQuestionAfter: (questionId, type) =>
    set((state) => {
      const index = state.questions.findIndex((q) => q.id === questionId);

      if (index === -1) return state;

      // ✅ create question properly with type
      const newQuestion = {
        ...createEmptyQuestion(),
        id: Date.now(),
        type,
      };

      let newOptions = [];

      if (type === "multiple") {
        newOptions = [
          createOption(newQuestion.id, "", "A"),
          createOption(newQuestion.id, "", "B"),
          createOption(newQuestion.id, "", "C"),
          createOption(newQuestion.id, "", "D"),
        ];
      }

      if (type === "boolean") {
        newOptions = [
          createOption(newQuestion.id, "True", "A"),
          createOption(newQuestion.id, "False", "B"),
        ];
      }

      // ✅ short = no options (correct)

      const newQuestions = [...state.questions];
      newQuestions.splice(index + 1, 0, newQuestion);

      return {
        questions: newQuestions,
        options: [...state.options, ...newOptions],
      };
    }),

  clearDirty: ({ questions = [], options = [], details = [] }) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        const match = questions.find((item) => item.id === q.id);
        if (!match) return q;

        const newDirtyFields = { ...q.dirtyFields };

        match.fields.forEach((field) => {
          delete newDirtyFields[field];
        });

        return {
          ...q,
          dirtyFields: newDirtyFields,
          isDirty: Object.keys(newDirtyFields).length > 0,
        };
      }),

      options: state.options.map((opt) => {
        const match = options.find((item) => item.id === opt.id);
        if (!match) return opt;

        const newDirtyFields = { ...opt.dirtyFields };

        match.fields.forEach((field) => {
          delete newDirtyFields[field];
        });

        return {
          ...opt,
          dirtyFields: newDirtyFields,
          isDirty: Object.keys(newDirtyFields).length > 0,
        };
      }),

      details: state.details
        ? (() => {
            const newDirtyFields = { ...state.details.dirtyFields };

            details.forEach((field) => {
              delete newDirtyFields[field];
            });

            return {
              ...state.details,
              dirtyFields: newDirtyFields,
              isDirty: Object.keys(newDirtyFields).length > 0,
            };
          })()
        : state.details,
    })),
}));
