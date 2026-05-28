"use client";

import QuizDetailsModal from "@/src/components/homePage/QuizDetailsModal";
import Link from "next/link";
import { useState } from "react";
import {
  HiMiniUserCircle,
  HiOutlinePlus,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { deleteQuiz } from "@/src/data-access/quiz";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
export default function Quizes({ quizzesList }) {
  const [quizDetails, setQuizDetails] = useState(null);
  const [quizzes, setQuizzes] = useState(quizzesList || []);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    await deleteQuiz(deleteId);

    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== deleteId));

    setDeleteId(null);
    setIsDeleting(false);
  };
  return (
    <div className="min-h-screen ">
      <div className=" w-full mx-auto p-4">
        <QuizDetailsModal
          key={quizDetails?.id || "create"}
          details={quizDetails}
          open={!!mode}
          mode={mode}
          onClose={() => setMode(null)}
          setQuizzes={setQuizzes}
        />
        <ConfirmDeleteModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          loading={isDeleting}
          quizDetails={quizDetails}
        />
        <div className="flex justify-end m-3 mx-4">
          {/* Create */}

          <button
            onClick={() => {
              (setQuizDetails(null), setMode("create"));
            }}
            className="
                  flex items-center gap-2
              px-5 py-3 rounded-xl text-white font-medium
              bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600
              shadow-sm hover:opacity-90 transition cursor-pointer
            "
          >
            <HiOutlinePlus className="text-[20px]" />
            Create Quiz
          </button>
        </div>
        <div className="flex flex-wrap   gap-4  ">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="
                group
                bg-white
                border border-slate-200
                rounded-3xl
                p-6
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <button
                disabled={loading}
                onClick={() => {
                  (setDeleteId(quiz.id), setQuizDetails(quiz));
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
              >
                Delete
              </button>

              {/* Top */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <Link
                    href={`/edit/${quiz.id}`}
                    target="_blank"
                    className="hover:underlined"
                  >
                    <h2 className="text-xl font-semibold text-slate-800">
                      {quiz.title ? quiz.title : "Untitled"}
                    </h2>
                  </Link>

                  <div>
                    <span
                      className="
                    py-1 px-1 rounded 
                    text-[11px] font-medium text-slate-800
                      bg-orange-100
            border border-orange-200
                    hover:opacity-90
                 shadow-sm
                    transition"
                    >
                      {quiz.subject}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}

              <div className="flex items-center   ">
                <span className="font-medium text-slate-500 uppercase text-xs">
                  {quiz.grade} / {quiz.quarter} Quarter
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
                {/* Secondary Button */}
                <button
                  onClick={() => {
                    (setQuizDetails(quiz), setMode("update"));
                  }}
                  className="
                px-4 py-2 rounded-xl
                text-sm font-medium
                bg-slate-300
                text-slate-700
                hover:bg-slate-200
                transition
                "
                >
                  Quick Edit
                </button>

                {/* Primary Button */}
                <Link
                  href={`/edit/${quiz.id}`}
                  target="_blank"
                  className="
      px-4 py-2 rounded-xl
      text-sm font-medium text-white
      bg-gradient-to-r
      from-teal-400
      to-cyan-500
      hover:opacity-90
      shadow-sm
      transition
    "
                >
                  Present
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
