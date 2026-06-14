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

export default normalizeSingleQuiz;
