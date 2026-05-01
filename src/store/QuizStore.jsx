// stores/quizStore.js
import { create } from "zustand";

const createEmptyQuestion = (type = "multiple") => ({
  question_id: Date.now(),
  question: "",
  type,
  layout: "col",
  correct: "",
  order: 0,
  isDirty: true,
  isNew: true, // 👈 add this (important)
  showLabel: true, // ✅ default ON
  dirtyFields: {
    question_id: true,
    question: true,
    type: true,
    layout: true,
    correct: true,
    showLabel: true, // ✅ track this
    order: true,
  },
});
const createOption = (questionId, order) => ({
  option_id: Date.now() + Math.random(),
  question_id: questionId,
  label: "",
  order: order,
  isDirty: true,
  isNew: true, // 👈 add this

  dirtyFields: {
    label: true,

    question_id: true,
    order: true,
  },
});

export const useQuizStore = create((set) => ({
  questions: [],
  options: [],
  deletedQuestions: [],
  deletedOptions: [],
  details: {},

  setDetails: (details) => set({ details }),
  moveQuestionUp: (id) =>
    set((state) => {
      const index = state.questions.findIndex((q) => q.question_id === id);
      if (index <= 0) return state;

      const newQuestions = [...state.questions];
      [newQuestions[index - 1], newQuestions[index]] = [
        newQuestions[index],
        newQuestions[index - 1],
      ];

      return {
        questions: newQuestions.map((q, i) => ({
          ...q,
          order: i,
          isDirty: true,
          dirtyFields: {
            ...(q.dirtyFields || {}),
            order: true, // ✅ correct
          },
        })),
      };
    }),

  moveQuestionDown: (id) =>
    set((state) => {
      const index = state.questions.findIndex((q) => q.question_id === id);
      if (index === -1 || index === state.questions.length - 1) return state;

      const newQuestions = [...state.questions];
      [newQuestions[index], newQuestions[index + 1]] = [
        newQuestions[index + 1],
        newQuestions[index],
      ];

      return {
        questions: newQuestions.map((q, i) => ({
          ...q,
          order: i,
          isDirty: true,
          dirtyFields: {
            ...(q.dirtyFields || {}),
            order: true, // ✅ correct
          },
        })),
      };
    }),
  moveQuestionTo: (id, targetIndex) =>
    set((state) => {
      const currentIndex = state.questions.findIndex(
        (q) => q.question_id === id,
      );

      if (currentIndex === -1) return state;

      const safeIndex = Math.max(
        0,
        Math.min(targetIndex, state.questions.length - 1),
      );
      // if (currentIndex === safeIndex) return state;

      const newQuestions = [...state.questions];
      const [movedItem] = newQuestions.splice(currentIndex, 1);
      newQuestions.splice(safeIndex, 0, movedItem);

      return {
        questions: newQuestions.map((q, i) => ({
          ...q,
          order: i,
          isDirty: true,
          dirtyFields: {
            ...(q.dirtyFields || {}),
            order: true, // ✅ correct
          },
        })),
        lastMovedId: id, // 👈 optional helper
      };
    }),
  updateQuestionLabelVisibility: (question_id, value) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.question_id !== question_id) return q;

        return {
          ...q,
          showLabel: value,
          isDirty: true,
          dirtyFields: {
            ...(q.dirtyFields || {}),
            showLabel: true,
          },
        };
      }),
    })),
  addQuestion: () =>
    set((state) => {
      const q = createEmptyQuestion("multiple");
      const newOptions = [createOption(q.question_id, 0)];

      return {
        questions: [...state.questions, q],
        options: [...state.options, ...newOptions],
      };
    }),
  addOption: (question_id) =>
    set((state) => {
      const currentOptions = state.options.filter(
        (opt) => opt.question_id === question_id,
      );
      // ✅ safer than length
      const maxOrder = currentOptions.length;
      // ? Math.max(...currentOptions.map((o) => o.order ?? 0))
      // : -1;

      const newOption = [createOption(question_id, maxOrder)];

      return {
        options: [...state.options, ...newOption],
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
  removeOption: (optionId) =>
    set((state) => {
      const opt = state.options.find((option) => option.option_id === optionId);

      return {
        options: state.options.filter(
          (option) => option.option_id !== optionId,
        ),
        deletedOptions: opt.isNew
          ? state.deletedOptions
          : [...state.deletedOptions, opt.option_id],
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
        isNew: true,
        dirtyFields: {
          question: true,
          type: true,
          layout: true,
          correct: true,
          showLabel: true,
          order: true,
        },
      };

      const newOptions = state.options
        .filter((opt) => opt.question_id === q.question_id)
        .map((opt) => ({
          ...opt,
          option_id: Date.now() + Math.random(),
          question_id: newId,
          isDirty: true,
          isNew: true,
          dirtyFields: {
            label: true,
            question_id: true,
            order: true,
          },
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
      const sorted = [...state.questions].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );

      let currentIndex =
        questionId === null
          ? sorted.length - 1
          : sorted.findIndex((q) => q.question_id === questionId);

      if (currentIndex === -1 && questionId !== null) return state;

      const newQuestion = {
        ...createEmptyQuestion(type),
        question_id: crypto.randomUUID(),
        type,
        order: 0,
      };

      let newOptions = [];
      if (type === "multiple") {
        newOptions = [createOption(newQuestion.question_id, 0)];
      }

      const insertIndex = currentIndex + 1;

      sorted.splice(insertIndex, 0, newQuestion);

      const updated = sorted.map((q, i) => {
        if (i < insertIndex) return q;

        return {
          ...q,
          order: i,
          isDirty: true,
          dirtyFields: {
            ...(q.dirtyFields || {}),
            order: true,
          },
        };
      });

      return {
        questions: updated,
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
          isNew: false,
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

      deletedOptions: [], //
    })),
}));
