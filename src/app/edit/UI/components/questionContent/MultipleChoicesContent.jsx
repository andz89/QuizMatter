import React from "react";
import MultipleChoicesInput from "./MultipleChoicesInput";
import DragOptions from "./DragOptions";
import { useQuizStore } from "../../store/QuizStore";

const getOptionLabel = (index) => {
  return String.fromCharCode(65 + index); // 65 = "A"
};

const MultipleChoicesContent = ({ q, setActiveEditor }) => {
  if (q.type !== "multiple") return null;
  const options = useQuizStore((s) => s.options);
  const addOption = useQuizStore((state) => state.addOption);

  return (
    <div
      className={`gap-2    ${
        q.layout === "row"
          ? "flex flex-row flex-wrap  min-w-10"
          : q.layout === "grid"
            ? "grid grid-cols-2 w-full"
            : "flex flex-col flex-base"
      }`}
    >
      {(() => {
        // ✅ always sort before render
        const questionOptions = options
          .filter((opt) => opt.question_id === q.question_id)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return (
          <>
            <DragOptions
              questionId={q.question_id}
              questionOptions={questionOptions}
            >
              {questionOptions.map((opt, index) => (
                <MultipleChoicesInput
                  showLabel={q.showLabel}
                  key={opt.option_id}
                  opt={opt}
                  index={index}
                  setActiveEditor={setActiveEditor}
                  questionOptionsLength={questionOptions.length}
                  correctAnswer={q.correct}
                />
              ))}
              <div className="flex flex-row items-center   ">
                {q.showLabel && (
                  <span className="font-bold  text-gray-400">
                    {getOptionLabel(questionOptions.length)}.
                  </span>
                )}
                <label className="flex items-start  mt-[-4px] ">
                  <input
                    disabled
                    type="radio"
                    className="  px-0 w-4 h-4 mx-2"
                  />
                </label>{" "}
                <input
                  placeholder="Add Option"
                  onFocus={(e) => {
                    (addOption(q.question_id), e.target.blur());
                  }}
                  className="bg-gray-50 border-b   border-gray-300 p-2   w-full"
                />
              </div>
            </DragOptions>
          </>
        );
      })()}

      {/* Footer */}
    </div>
  );
};

export default MultipleChoicesContent;
