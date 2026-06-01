"use client";

import QuizEditDetailsModal from "@/src/app/(homepage)/components/QuizEditDetailsModal";
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { deleteQuiz } from "@/src/data-access/quiz";
import { BsArrowsAngleExpand } from "react-icons/bs";

import ConfirmDeleteModal from "@/src/components/modal/ConfirmDeleteModal";
import ViewFullDetails from "./ViewFullDetails";
import Options from "./Options";
import Presentation from "@/src/components/presentation/Presentation";
export default function Quizes({ quizzesList }) {
  const [quizDetails, setQuizDetails] = useState(null);
  const [quizzes, setQuizzes] = useState(quizzesList || []);
  const [mode, setMode] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const handleDelete = async () => {
    setIsDeleting(true);

    await deleteQuiz(deleteId);

    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== deleteId));

    setDeleteId(null);
    setIsDeleting(false);
  };
  const handleViewDetails = (quiz) => {
    setMode("view");
    setQuizDetails(quiz);
    // setShowAllDetails(!showAllDetails);
  };

  return (
    <div className="min-h-screen ">
      <div className=" w-full mx-auto p-4">
        <ConfirmDeleteModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          loading={isDeleting}
          quizDetails={quizDetails}
        />
        <ViewFullDetails
          setMode={setMode}
          quiz={quizDetails}
          open={mode === "view"}
          onClose={() => setMode(null)}
        />
        <QuizEditDetailsModal
          key={quizDetails?.id || "create"}
          details={quizDetails}
          open={mode === "update" || mode === "create"}
          mode={mode}
          onClose={() => setMode(null)}
          setQuizzes={setQuizzes}
        />
        <Presentation
          quiz={quizDetails}
          open={mode === "present"}
          onClose={() => setMode("view")}
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
        <div className="flex flex-wrap   gap-4  items-center ">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="
              w-full
             lg:max-w-[340px]
             md:max-w-[340px]
                bg-white
                border border-slate-200
                rounded-2xl
                p-3
                shadow-sm
                hover:shadow-lg
                
                transition-all
                duration-300
              "
            >
              {/* Top */}
              <div className="flex items-start   mb-2">
                <div
                  onClick={() => handleViewDetails(quiz)}
                  className="w-full cursor-pointer "
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      className="        text-xl font-semibold text-slate-800
        whitespace-nowrap overflow-hidden text-ellipsis pr-5 w-[280px]"
                    >
                      {quiz.title ? quiz.title : "Untitled"}
                    </h2>
                  </div>

                  <div className="flex items-center   gap-1 mb-1">
                    <span
                      className="
                    px-3 py-1
                    rounded-full
                    text-xs font-semibold
                    text-orange-700
                    bg-orange-100
                    border border-orange-200
                  "
                    >
                      {quiz.subject}
                    </span>
                    <span className="font-medium text-slate-500 uppercase text-xs">
                      {quiz.grade} / {quiz.quarter} Quarter
                    </span>
                  </div>
                  <div>
                    <span className="mt-1 text-sm font-medium text-slate-500  ">
                      {" "}
                      Competencies / Objectives:
                    </span>
                    <div
                      className={
                        "text-sm text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis"
                      }
                    >
                      {quiz.objectives}
                    </div>
                  </div>
                </div>
                {/* options */}
                <Options
                  quiz={quiz}
                  openMenuId={openMenuId}
                  setQuizDetails={setQuizDetails}
                  setMode={setMode}
                  setOpenMenuId={setOpenMenuId}
                  isDeleting={isDeleting}
                  setDeleteId={setDeleteId}
                />
              </div>

              {/* Info */}

              {/* Footer */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
