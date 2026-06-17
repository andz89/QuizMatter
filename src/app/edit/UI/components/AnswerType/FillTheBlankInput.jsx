import React from "react";

import { useQuizStore } from "../../store/QuizStore";
import TinyInputEditor from "../../editor/TinyInputEditor";

const FillTheBlankInput = ({ q, setActiveEditor }) => {
  if (q.type !== "short") return null;
  const question = useQuizStore((state) =>
    state.questions.find((q) => q.question_id === q.question_id),
  );
  const updateQuestion = useQuizStore((state) => state.updateQuestion);
  const handleOptionChange = (value) => {
    updateQuestion(q.question_id, {
      correct: value,
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">Correct Answer</span>
      <div className="bg-gray-50 border-b  border-gray-300 p-2   w-full ">
        <TinyInputEditor
          value={question?.correct || ""}
          onChange={handleOptionChange}
          setActiveEditor={setActiveEditor}
        />
      </div>
    </div>
  );
};

export default FillTheBlankInput;
