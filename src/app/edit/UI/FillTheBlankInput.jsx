import React from "react";

import { useQuizStore } from "./store/QuizStore";
import TinyInputEditor from "./editor/TinyInputEditor";

const FillTheBlankInput = ({ question_id, setActiveEditor }) => {
  const question = useQuizStore((state) =>
    state.questions.find((q) => q.question_id === question_id),
  );
  const updateQuestion = useQuizStore((state) => state.updateQuestion);
  const handleOptionChange = (value) => {
    updateQuestion(question_id, {
      correct: value,
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">Correct Answer</span>

      <TinyInputEditor
        value={question?.correct || ""}
        onChange={handleOptionChange}
        setActiveEditor={setActiveEditor}
      />
    </div>
  );
};

export default FillTheBlankInput;
