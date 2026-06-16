import Image from "next/image";
import FloatingToolbar from "../editor/FloatingToolbar";
import PublishSettingsModal from "../../../../components/modal/PublishSettingsModal";
import Presentation from "@/src/components/presentation/Presentation";
import { useQuizStore } from "../store/QuizStore";
import toast from "react-hot-toast";

import { useSaveQuiz } from "../utils/useSaveQuiz";
import React, { useState, useEffect, useRef } from "react";
import { BsArrowsAngleExpand } from "react-icons/bs";
const Header = ({
  activeEditor,
  setManualSave,

  isDirty,

  questions,
  options,
  setMode,
  mode,
}) => {
  const { handleSave, sending, error } = useSaveQuiz();
  const details = useQuizStore((s) => s.details);
  const [openPublishModal, setOpenPublishModal] = useState(false); // publish modal state
  // publish handler, for now it just logs the settings, you can replace it with your API call to publish the quiz
  const handlePublish = (settings) => {
    console.log("Publishing with settings:", settings);

    // call   API here
  };
  const presentationQuiz = {
    // prepare quiz data for presentation component, you can optimize this by memoizing it or preparing the data in the store when setting the quiz details
    ...details,

    questions: questions.map((question) => ({
      ...question,

      options: options
        .filter((opt) => opt.question_id === question.question_id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    })),
  };
  useEffect(() => {
    if (!error?.message) return;

    toast.error(error.message);
  }, [error]);
  const saveRef = useRef(handleSave); // to always have the latest handleSave function in the interval, without resetting the interval
  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);
  //  INTERVAL AUTOSAVE (stable, no reset)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     saveRef.current(); // always latest, but interval never resets
  //   }, 15000);
  //   if (!isDirty) return; // if not dirty, don't set interval
  //   return () => clearInterval(interval);
  // }, []);
  return (
    <div className="fixed top-0 py-2 bg-gray-50 z-51 flex items-center justify-between border-b border-gray-200 w-full px-4">
      {/* quiz header */}
      <PublishSettingsModal // modal
        isOpen={openPublishModal}
        onClose={() => setOpenPublishModal(false)}
        onPublish={handlePublish}
      />
      <Presentation
        quiz={presentationQuiz}
        open={mode === "present"}
        onClose={() => setMode("view")}
      />
      <div>
        <Image
          src="/quizmatter-logo.png"
          alt="School Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* Center */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <FloatingToolbar editor={activeEditor} />
      </div>
      <div className="  flex items-center gap-3">
        <button
          onClick={() => {
            setMode("present");
          }}
          className="
          mx-2
          cursor-pointer
        "
        >
          <BsArrowsAngleExpand
            size={22}
            className="text-2xl text-slate-800 hover:text-orange-500 transition  "
          />
        </button>

        <button
          onClick={() => {
            setManualSave(true);
            handleSave();
          }}
          disabled={sending || !isDirty}
          className={`px-4 py-2 rounded shadow-sm ${
            sending
              ? "bg-gray-400"
              : !isDirty
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-slate-900 text-white cursor-pointer"
          }`}
        >
          Save
        </button>

        <button
          onClick={() => setOpenPublishModal(true)}
          className={`cursor-pointer px-4 py-2 rounded shadow-sm bg-orange-500 text-white `}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default Header;
