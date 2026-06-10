import React from "react";
import { useQuizStore } from "./store/QuizStore";

const LayoutOptions = ({ id, layoutData }) => {
  const updateQuestion = useQuizStore((state) => state.updateQuestion);

  // ✅ guard against undefined (very important)
  if (!layoutData) return null;

  return (
    <div className="flex gap-2 text-sm">
      <span>Options layout:</span>

      {["col", "row", "grid"].map((layout) => (
        <label key={layout} className="flex gap-1">
          <input
            type="radio"
            checked={layoutData === layout}
            onChange={() => updateQuestion(id, { layout })}
          />
          {layout}
        </label>
      ))}
    </div>
  );
};

export default LayoutOptions;
