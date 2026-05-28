"use client";

import React from "react";

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  quizDetails,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div
        className="
          w-full max-w-md
          bg-white
          rounded-3xl
          shadow-2xl
          border border-slate-200
          p-6
          animate-in fade-in zoom-in-95
        "
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Delete Quiz</h2>

          <p className="text-sm text-slate-500 mt-2">
            {`Are you sure you want to delete "${quizDetails.title} - ${quizDetails.subject}/${quizDetails.grade}/${quizDetails.quarter} Quarter"? This action cannot be
            undone.`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              px-4 py-2
              rounded-xl
              bg-slate-200
              hover:bg-slate-300
              text-slate-700
              text-sm font-medium
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              px-4 py-2
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-white
              text-sm font-medium
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
