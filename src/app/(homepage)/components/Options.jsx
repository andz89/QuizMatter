import Link from "next/link";
import React from "react";
import {
  HiOutlinePlus,
  HiTrash,
  HiMiniPencilSquare,
  HiEllipsisVertical,
  HiOutlineTv,
} from "react-icons/hi2";

const Options = ({
  quiz,
  openMenuId,
  setQuizDetails,
  setMode,
  setOpenMenuId,
  isDeleting,
  setDeleteId,
}) => {
  return (
    <div className=" flex items-center justify-between -ml-7  border-t border-slate-100 relative">
      <button
        onClick={() => setOpenMenuId(openMenuId === quiz.id ? null : quiz.id)}
        className="
 text-slate-200
      hover:bg-slate-100
      transition
      cursor-pointer
      ml-2
    "
      >
        <HiEllipsisVertical size={25} className="text-slate-600" />
      </button>

      {/* Dropdown Menu */}
      {openMenuId === quiz.id && (
        <div
          className="
        absolute left-0 top-7
        w-48
        bg-white
        border border-slate-200
        rounded-xl
        shadow-lg
        z-20
        overflow-hidden
      "
        >
          <div className="flex flex-col gap-2  p-2 text-md   text-slate-600  ">
            <Link
              href={`/edit/${quiz.id}`}
              target="_blank"
              className="
         flex items-center gap-2
           py-1 px-2   
          hover:bg-slate-50
          transition 
        "
            >
              <HiMiniPencilSquare size={22} />
              Edit Questions
            </Link>

            <button
              onClick={() => {
                setQuizDetails(quiz);
                setMode("present");
              }}
              className="
           flex items-center gap-2
          hover:bg-slate-50   py-1 px-2   
          transition
        "
            >
              <HiOutlineTv size={22} />
              Present
            </button>

            <button
              disabled={isDeleting}
              onClick={() => {
                setDeleteId(quiz.id);
                setQuizDetails(quiz);
                setOpenMenuId(null);
              }}
              className="
          w-full flex  items-center gap-2
         py-1 px-2   
          text-red-500
          hover:bg-red-50
          transition
        "
            >
              <HiTrash size={22} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
