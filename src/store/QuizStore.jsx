// stores/quizStore.js
import { create } from "zustand";

const createEmptyQuestion = (type = "multiple") => ({
  question_id: Date.now(),
  question: "",
  type,
  layout: "col",
  correct: "",
  isDirty: true,
  isNew: true, // 👈 add this (important)

  dirtyFields: {
    question_id: true,
    question: true,
    type: true,
    layout: true,
    correct: true,
  },
});
const createOption = (questionId, label = "", value = "") => ({
  option_id: Date.now() + Math.random(),
  question_id: questionId,
  label,
  value,
  isDirty: true,
  isNew: true, // 👈 add this

  dirtyFields: {
    label: true,
    value: true,
    question_id: true,
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
        createOption(q.question_id, "", "A"),
        createOption(q.question_id, "", "B"),
        createOption(q.question_id, "", "C"),
        createOption(q.question_id, "", "D"),
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
        q.question_id === id
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
        opt.option_id === id
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
  removeQuestion: (questionId) =>
    set((state) => {
      const q = state.questions.find(
        (question) => question.question_id === questionId,
      );
      console.log("Removing question", questionId, "question:", q);
      return {
        questions: state.questions.filter(
          (question) => question.question_id !== questionId,
        ),
        options: state.options.filter(
          (opt) => opt.question_id !== q.question_id,
        ),
        deletedQuestions: q.isNew
          ? state.deletedQuestions
          : [...state.deletedQuestions, q.question_id],
      };
    }),

  duplicateQuestion: (questionId) =>
    set((state) => {
      const index = state.questions.findIndex(
        (q) => q.question_id === questionId,
      );

      if (index === -1) return state;

      const q = state.questions[index];
      const newId = Date.now();

      const newQuestion = {
        ...q,
        question_id: newId,
        isDirty: true,
      };

      const newOptions = state.options
        .filter((opt) => opt.question_id === q.question_id)
        .map((opt) => ({
          ...opt,
          option_id: Date.now() + Math.random(),
          question_id: newId,
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
      const index = state.questions.findIndex(
        (q) => q.question_id === questionId,
      );

      if (index === -1) return state;

      // ✅ create question properly with type
      const newQuestion = {
        ...createEmptyQuestion(),
        question_id: Date.now(),
        type,
      };

      let newOptions = [];

      if (type === "multiple") {
        newOptions = [
          createOption(newQuestion.question_id, "", "A"),
          createOption(newQuestion.question_id, "", "B"),
          createOption(newQuestion.question_id, "", "C"),
          createOption(newQuestion.question_id, "", "D"),
        ];
      }

      if (type === "boolean") {
        newOptions = [
          createOption(newQuestion.question_id, "True", "A"),
          createOption(newQuestion.question_id, "False", "B"),
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
        const match = questions.find(
          (item) => item.question_id === q.question_id,
        );
        if (!match) return q;

        const newDirtyFields = { ...q.dirtyFields };

        match.fields.forEach((field) => {
          delete newDirtyFields[field];
        });

        return {
          ...q,
          isNew: false,
          dirtyFields: newDirtyFields,
          isDirty: Object.keys(newDirtyFields).length > 0,
        };
      }),

      options: state.options.map((opt) => {
        const match = options.find((item) => item.option_id === opt.option_id);
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
      deletedQuestions: [], //
    })),
}));
