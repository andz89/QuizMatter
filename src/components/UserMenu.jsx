"use client";

import { useEffect, useRef, useState } from "react";
import {
  HiMiniUserCircle,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

export default function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="
          rounded-full
          transition-all
          hover:scale-105
          active:scale-95
          cursor-pointer
        "
      >
        <HiMiniUserCircle className="text-[42px] text-slate-600 hover:text-orange-500 transition-colors" />
      </button>

      {/* Menu */}
      <div
        className={`
          absolute right-0 top-[56px]
          w-[260px]
          rounded-3xl
          border border-slate-200
          bg-white/95
          backdrop-blur-xl
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          p-3
          transition-all duration-200
          ${
            open
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible"
          }
        `}
      >
        {/* User */}
        <div
          className="
            flex items-center gap-3
            p-3
            rounded-2xl
            bg-orange-50
            border border-orange-100
          "
        >
          <div>
            <HiMiniUserCircle className="text-[42px] text-orange-500" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-500">Signed in as</p>

            <h3 className="font-semibold text-slate-800 truncate">
              {user.displayName ? user.displayName : user.email}
            </h3>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 my-3" />

        {/* Logout */}
        <form>
          <button
            formAction={logout}
            className="
              w-full
              h-12
              px-4
              rounded-2xl
              hover:bg-slate-100
              text-slate-700
              font-medium
              flex items-center gap-3
              transition-all
            "
          >
            <HiOutlineArrowRightOnRectangle className="text-[20px]" />

            <span>Logout</span>
          </button>
        </form>
      </div>
    </div>
  );
}
