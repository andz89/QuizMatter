import React, { useRef, useEffect } from "react";
import { useQuizStore } from "../../store/QuizStore";
const MultipleChoicesInput = ({ opt }) => {
  const updateOption = useQuizStore((state) => state.updateOption);
  const updateQuestion = useQuizStore((state) => state.updateQuestion);
  const questions = useQuizStore((state) => state.questions);

  const ref = useRef(null);

  const question = questions.find((q) => q.question_id === opt.question_id);

  const handleOptionChange = (value) => {
    updateOption(opt.option_id, {
      label: value,
    });
  };

  const handleCorrectChange = () => {
    updateQuestion(opt.question_id, {
      correct: opt.value,
    });
  };

  useEffect(() => {
    if (ref.current && ref.current.innerText !== opt.label) {
      ref.current.innerText = opt.label || "";
    }
  }, [opt.label]);

  if (!question) return null;

  return (
    <div className="flex flex-row items-start gap-1">
      {/* Radio */}
      <label className="flex items-start mt-[11px] gap-1">
        <input
          type="radio"
          checked={question.correct === opt.value}
          onChange={handleCorrectChange}
        />
      </label>

      {/* Label */}
      <span className="w-[20px] font-bold mt-[6px]">{opt.value}.</span>

      {/* Editable */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="focus:outline-none bg-gray-50 border border-gray-300 rounded p-1 w-full min-h-[30px]"
        onInput={(e) => handleOptionChange(e.currentTarget.textContent)}
      />
    </div>
  );
};
export default MultipleChoicesInput;
