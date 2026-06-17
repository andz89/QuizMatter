import React, { useState, useRef, useEffect } from "react";
import { useQuizStore } from "../../../store/QuizStore";
import { HiChevronDown } from "react-icons/hi";

const layouts = ["col", "row", "grid"];

const LayoutOptions = ({ id, layoutData }) => {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const updateQuestion = useQuizStore((state) => state.updateQuestion);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!layoutData) return null;

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded bg-white text-sm text-gray-600"
      >
        Layout: {layoutData}
        <HiChevronDown />
      </button>

      {open && (
        <div className="absolute top-[-80px] left-0 mt-1 w-32 bg-white border border-gray-300 rounded shadow-lg z-50 text-gray-600">
          {layouts.map((layout) => (
            <button
              key={layout}
              type="button"
              onClick={() => {
                updateQuestion(id, { layout });
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                layoutData === layout ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {layout}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayoutOptions;
