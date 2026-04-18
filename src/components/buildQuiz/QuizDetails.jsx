import React from "react";
import { useQuizStore } from "../../store/QuizStore";

const QuizDetails = () => {
  const { details, updateDetails } = useQuizStore();

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Quiz Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Quiz Title</label>
          <input
            value={details.title || ""}
            onChange={(e) => updateDetails("title", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Grade */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Grade Level</label>

          <select
            key={details.grade || ""}
            value={
              details.grade?.trim().replace(/^./, (c) => c.toUpperCase()) || ""
            }
            onChange={(e) => updateDetails("grade", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Grade</option>
            {Array.from({ length: 10 }, (_, i) => {
              const grade = `Grade ${i + 1}`;
              return (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              );
            })}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Subject</label>
          <select
            value={
              details.subject?.trim().replace(/^./, (c) => c.toUpperCase()) ||
              ""
            }
            onChange={(e) => updateDetails("subject", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Subject</option>
            <option value="Math">Math</option>
            <option value="Filipino">Filipino</option>
            <option value="MAPEH">MAPEH</option>
            <option value="English">English</option>
            <option value="EPP">EPP</option>
            <option value="Araling Panlipunan">Araling Panlipunan</option>
            <option value="ESP">ESP</option>
            <option value="Science">Science</option>
          </select>
        </div>

        {/* Quarter */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Quarter</label>
          <select
            value={details.quarter?.trim() || ""}
            onChange={(e) => updateDetails("quarter", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Quarter</option>
            <option value="1st">1st Quarter</option>
            <option value="2nd">2nd Quarter</option>
            <option value="3rd">3rd Quarter</option>
            <option value="4th">4th Quarter</option>
          </select>
        </div>
      </div>

      {/* Objectives */}
      <div className="flex flex-col mt-4">
        <label className="text-sm text-gray-600 mb-1">
          Competencies / Objectives
        </label>
        <textarea
          rows={3}
          value={details.objectives || ""}
          onChange={(e) => updateDetails("objectives", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>
    </div>
  );
};

export default QuizDetails;
