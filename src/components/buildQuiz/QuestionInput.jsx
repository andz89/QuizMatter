import React, { useRef, useEffect } from "react";
import { useQuizStore } from "../../store/QuizStore";
const QuestionInput = ({ id, index }) => {
  const question = useQuizStore(
    (state) => state.questions.find((q) => q.question_id === id),
    (a, b) => a?.question === b?.question,
  );

  const updateQuestion = useQuizStore((state) => state.updateQuestion);

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // prevent cursor jump while typing
    if (document.activeElement === ref.current) return;

    ref.current.innerText = question?.question || "";
  }, [question?.question]);

  if (!question) return null;

  return (
    <div className="bg-gray-50 border border-gray-300 p-1 flex">
      <span className="font-bold text-gray-600">{index + 1}.</span>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="w-full min-h-[40px] focus:outline-none"
        onInput={(e) =>
          updateQuestion(id, {
            question: e.currentTarget.innerText.trimStart(),
          })
        }
        onPaste={(e) => {
          e.preventDefault();

          // get plain text only
          let text = e.clipboardData.getData("text/plain");

          // optional: normalize line breaks
          text = text.replace(/\r\n/g, "\n");

          // insert at cursor
          document.execCommand("insertText", false, text);
        }}
      />
    </div>
  );
};
export default QuestionInput;
