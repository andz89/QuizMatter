export function buildQuizPayload({
  questions,
  options,
  details,
  deletedQuestions,
}) {
  const dirtyQuestions = questions.filter((q) => q.isDirty);
  const dirtyOptions = options.filter((o) => o.isDirty);
  const dirtyDetails = details?.isDirty;

  const hasChanges =
    dirtyQuestions.length > 0 ||
    dirtyOptions.length > 0 ||
    dirtyDetails ||
    deletedQuestions.length > 0;

  if (!hasChanges) return null;

  const questionPayload = dirtyQuestions.map((q) => {
    const fields = Object.keys(q.dirtyFields || {});
    const updatedFields = fields.reduce((acc, key) => {
      acc[key] = q[key];
      return acc;
    }, {});
    return {
      quiz_id: details.quizId,
      question_id: q.question_id,
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
      option_id: o.option_id,
      question_id: o.question_id,
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

  return {
    questions: questionPayload,
    options: optionPayload,
    details: detailsPayload,
    deletedQuestions,
    dirtyQuestions,
    dirtyOptions,
    dirtyDetails,
  };
}
