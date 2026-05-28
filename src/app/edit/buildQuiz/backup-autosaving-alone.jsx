const { questions, addQuestion, options, clearDirty, setDetails, details } =
  useQuizStore();

const debouncedQuestions = useDebounce(questions, 2500);
const debouncedOptions = useDebounce(options, 2500);
const debouncedDetails = useDebounce(details, 2500);

const isSavingRef = useRef(false);

useEffect(() => {
  const dirtyQuestions = debouncedQuestions.filter((q) => q.isDirty);
  const dirtyOptions = debouncedOptions.filter((o) => o.isDirty);
  const dirtyDetails = debouncedDetails?.isDirty;

  if (dirtyQuestions.length === 0 && dirtyOptions.length === 0 && !dirtyDetails)
    return;
  if (!debouncedDetails?.quizId) return; // 🔥 REQUIRED
  if (isSavingRef.current) return; // 🚫 prevent overlap

  const save = async () => {
    isSavingRef.current = true;
    const questionPayload = dirtyQuestions.map((q) => {
      const fields = Object.keys(q.dirtyFields || {});

      const updatedFields = fields.reduce((acc, key) => {
        acc[key] = q[key];
        return acc;
      }, {});

      return {
        quizId: debouncedDetails?.quizId,
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
          id: debouncedDetails.quizId,
          ...Object.fromEntries(
            Object.keys(debouncedDetails.dirtyFields || {}).map((k) => [
              k,
              debouncedDetails[k],
            ]),
          ),
        }
      : null;
    console.log("Saving...", {
      questions: questionPayload,
      options: optionPayload,
      details: detailsPayload,
    });

    clearDirty(
      questionPayload.map((q) => q.id),
      dirtyOptions.map((o) => o.id),
      dirtyDetails,
    );

    isSavingRef.current = false;
  };

  save();
}, [debouncedQuestions, debouncedOptions, debouncedDetails]);
