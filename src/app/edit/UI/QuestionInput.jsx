import React, { useState, useEffect } from "react";
import { useQuizStore } from "./store/QuizStore";
import TinyInputEditor from "./editor/TinyInputEditor";

const QuestionInput = ({ id, index, setActiveEditor }) => {
  const question = useQuizStore((state) =>
    state.questions.find((q) => q.question_id === id),
  );
  console.log("Question input", id);

  const updateQuestion = useQuizStore((state) => state.updateQuestion);

  const [localValue, setLocalValue] = useState(() => question?.question || "");

  useEffect(() => {
    setLocalValue(question?.question || "");
  }, [id]);

  useEffect(() => {
    if (!question) return;

    if (localValue === question.question) return;

    const timer = setTimeout(() => {
      updateQuestion(id, {
        question: localValue,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [localValue]);

  if (!question) return null;

  return (
    <div className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full  ">
      <TinyInputEditor
        value={localValue}
        onChange={setLocalValue}
        setActiveEditor={setActiveEditor}
        index={index}
        inputFrom={"question"}
      />
    </div>
  );
};

export default React.memo(QuestionInput);
