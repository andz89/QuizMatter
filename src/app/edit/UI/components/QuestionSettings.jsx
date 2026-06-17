import React from "react";
import { useQuizStore } from "../store/QuizStore";
import LayoutOptions from "./QuestionSettings/LayoutOptions";
import ShowLabel from "./QuestionSettings/ShowLabel";
const OptionsReference = ({ q }) => {
  if (q.type !== "multiple") return null;

  const updateQuestionLabelVisibility = useQuizStore(
    (s) => s.updateQuestionLabelVisibility,
  );
  // const updateQuestion = useQuizStore((state) => state.updateQuestion);
  return (
    <div className="flex justify-between items-center">
      <LayoutOptions id={q.question_id} layoutData={q.layout} />

      <div className="flex items-center justify-start gap-2">
        <ShowLabel
          label="Label"
          checked={q.showLabel ?? true}
          onChange={(e) =>
            updateQuestionLabelVisibility(q.question_id, e.target.checked)
          }
        />
      </div>
    </div>
  );
};

export default OptionsReference;
