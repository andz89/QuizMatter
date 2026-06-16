"use client";

import React, { useTransition } from "react";

import { updateQuizDetails } from "@/src/data-access/quiz";
const EditQuizDetails = ({ details = {}, open, onClose, setQuizDetails }) => {
  if (!open) return null;
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const updatedQuiz = await updateQuizDetails(formData);

      setQuizDetails(updatedQuiz);

      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center   bg-gray-200/50  ">
      <div
        className="
          w-full max-w-3xl
          bg-white
          rounded-3xl
          shadow-2xl
          border border-slate-200
          p-6
          animate-in fade-in zoom-in-95
        "
      >
        <form
          action={handleSubmit}
          className="
          p-5
        "
        >
          <div className="flex items-center justify-between   w-full">
            <h2 className="text-lg font-semibold text-slate-700">
              Quiz Details
            </h2>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onClose()}
                type="button"
                className="
            px-5 py-2
            rounded-xl
            bg-slate-200 hover:bg-slate-300
            text-slate-700
            text-sm font-medium
            transition
            disabled:opacity-50
            cursor-pointer
          "
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="
            px-5 py-2
            rounded-xl
            cursor-pointer

            bg-orange-500 hover:bg-orange-600
            text-white text-sm font-medium
            transition
            disabled:opacity-50
          "
              >
                {isPending ? "Updating..." : "Update "}
              </button>
            </div>
          </div>

          {/* Hidden ID for update */}
          {details?.quizId && (
            <input type="hidden" name="id" value={details.quizId} />
          )}
          {/* Title */}
          <div className="flex flex-col my-2">
            <label className="text-sm text-slate-600 mb-1">Quiz Title</label>

            <input
              name="title"
              defaultValue={details?.title || ""}
              className="
              border border-slate-300
              rounded-xl
              px-3 py-2.5
              focus:outline-none
              focus:ring-2
              focus:ring-orange-400
            "
            />
          </div>
          <div className="flex gap-4 w-full">
            {/* Grade */}
            <div className="flex flex-col w-full">
              <label className="text-sm text-slate-600 mb-1">Grade Level</label>

              <select
                name="grade"
                defaultValue={details?.grade || ""}
                className="
              border border-slate-300
              rounded-xl
              px-3 py-2.5
              focus:outline-none
              focus:ring-2
              focus:ring-orange-400
            "
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
            <div className="flex flex-col w-full">
              <label className="text-sm text-slate-600 mb-1">Subject</label>

              <select
                name="subject"
                defaultValue={details?.subject || ""}
                className="
              border border-slate-300
              rounded-xl
              px-3 py-2.5
              focus:outline-none
              focus:ring-2
              focus:ring-orange-400
            "
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
            <div className="flex flex-col w-full">
              <label className="text-sm text-slate-600 mb-1">Quarter</label>

              <select
                name="quarter"
                defaultValue={details?.quarter || ""}
                className="
              border border-slate-300
              rounded-xl
              px-3 py-2.5
              focus:outline-none
              focus:ring-2
              focus:ring-orange-400
            "
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
            <label className="text-sm text-slate-600 mb-1">
              Competencies / Objectives
            </label>

            <textarea
              name="objectives"
              rows={10}
              defaultValue={details?.objectives || ""}
              className="
            border border-slate-300
            rounded-xl
            px-3 py-2.5
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
          "
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuizDetails;
