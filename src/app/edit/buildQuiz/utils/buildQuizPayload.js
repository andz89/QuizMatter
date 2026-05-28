export function buildQuizPayload({
  questions,
  options,
  details,
  deletedQuestions,
  deletedOptions,
}) {
  const pick = (source, keys) =>
    Object.fromEntries(
      keys
        .filter((key) => source[key] !== undefined)
        .map((key) => [key, source[key]]),
    );

  const dirtyQuestions = questions.filter((q) => q.isDirty);
  const dirtyOptions = options.filter((o) => o.isDirty);
  const dirtyDetails = details?.isDirty;

  const hasChanges =
    dirtyQuestions.length > 0 ||
    dirtyOptions.length > 0 ||
    dirtyDetails ||
    deletedQuestions.length > 0 ||
    deletedOptions.length > 0;

  if (!hasChanges) return null;

  const questionPayload = dirtyQuestions.map((q) => {
    const fields = q.isNew
      ? ["question", "type", "layout", "correct", "showLabel", "order"]
      : Object.keys(q.dirtyFields || {});
    const updatedFields = fields.reduce((acc, key) => {
      acc[key] = q[key];
      return acc;
    }, {});
    return {
      quiz_id: details.quizId,
      question_id: q.question_id,
      isNew: q.isNew,
      ...updatedFields,
    };
  });

  const optionPayload = dirtyOptions.map((o) => {
    const updatedFields = o.isNew
      ? pick(o, ["label", "order"])
      : pick(o, Object.keys(o.dirtyFields || {}));

    return {
      option_id: o.option_id,
      question_id: o.question_id,
      isNew: o.isNew,
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
    deletedOptions,
    dirtyQuestions,
    dirtyOptions,
    dirtyDetails,
  };
}
