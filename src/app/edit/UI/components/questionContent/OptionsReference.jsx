import React from "react";
import { useQuizStore } from "../../store/QuizStore";
const OptionsReference = ({ q }) => {
  if (q.type !== "multiple") return null;

  const updateQuestionLabelVisibility = useQuizStore(
    (s) => s.updateQuestionLabelVisibility,
  );
  const updateQuestion = useQuizStore((state) => state.updateQuestion);
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 text-sm text-gray-700 mx-4">
        <span>Options layout:</span>

        {["col", "row", "grid"].map((layout) => (
          <label key={layout} className="flex gap-1 ">
            <input
              className="accent-slate-600 w-4"
              type="radio"
              checked={q.layout === layout}
              onChange={() => updateQuestion(q.question_id, { layout })}
            />
            {layout}
          </label>
        ))}
      </div>
      <div className="flex items-center justify-start gap-2 ">
        <div className="flex items-center justify-between gap-2 w-[70px] mx-3">
          <label className="text-sm font-medium text-gray-700">Label</label>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={q.showLabel ?? true}
              onChange={(e) =>
                updateQuestionLabelVisibility(q.question_id, e.target.checked)
              }
              className="sr-only peer"
            />

            <div
              className="w-[30px] h-[14px] bg-gray-300 rounded-full relative
                            transition-colors duration-300
                            peer-checked:bg-orange-500
                            after:content-[''] after:absolute after:top-[1px] after:left-[1px]
                            after:bg-white after:border after:border-gray-300
                            after:rounded-full after:h-3 after:w-3
                            after:transition-all after:duration-300

                            peer-checked:after:translate-x-[16px]
                            peer-checked:after:border-orange-500
                            peer-checked:shadow-sm
"
            >
              {" "}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default OptionsReference;
