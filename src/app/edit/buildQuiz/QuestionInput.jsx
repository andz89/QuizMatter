import React from "react";
import { useQuizStore } from "../buildQuiz/store/QuizStore";
import TinyInputEditor from "././editor/TinyInputEditor";

const QuestionInput = ({ id, index, setActiveEditor }) => {
  const question = useQuizStore((state) =>
    state.questions.find((q) => q.question_id === id),
  );

  const updateQuestion = useQuizStore((state) => state.updateQuestion);

  if (!question) return null;

  return (
    <div className="bg-gray-50 border border-gray-300 p-2   rounded-lg w-full">
      <TinyInputEditor
        value={question.question || ""}
        onChange={(value) =>
          updateQuestion(id, {
            question: value,
          })
        }
        setActiveEditor={setActiveEditor}
        index={index}
        inputFrom={"question"}
      />
    </div>
  );
};

export default QuestionInput;
