import Link from "next/link";
import React from "react";
import {
  HiTrash,
  HiMiniPencilSquare,
  HiEllipsisVertical,
} from "react-icons/hi2";
import { BsArrowsAngleExpand } from "react-icons/bs";

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
    <div className=" flex items-center justify-between -ml-12 border-t border-slate-100 relative">
      <div className="flex items-center gap-1">
        <BsArrowsAngleExpand
          onClick={() => {
            setQuizDetails(quiz);
            setMode("present");
          }}
          size={17}
          className="  text-slate-800 hover:text-orange-500 transition  cursor-pointer"
        />
        <button
          onClick={() => setOpenMenuId(openMenuId === quiz.id ? null : quiz.id)}
          className="
 text-slate-200
      hover:bg-slate-100
      transition
      cursor-pointer
      
    "
        >
          <HiEllipsisVertical size={25} className="text-slate-600" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {openMenuId === quiz.id && (
        <div
          className="
        absolute right-0 top-7
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
