import React from "react";

const ShowLabel = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-2 w-[70px] mx-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        <div
          className="w-[30px] h-[14px] bg-gray-300 rounded-full relative
          transition-colors duration-300
          peer-checked:bg-orange-500
          after:content-[''] after:absolute after:top-[1px] after:left-[1px]
          after:bg-white after:border after:border-gray-300
          after:rounded-full after:h-3 after:w-3
          after:transition-all after:duration-300
          peer-checked:after:translate-x-[16px]
          peer-checked:after:border-orange-500
          peer-checked:shadow-sm"
        />
      </label>
    </div>
  );
};

export default React.memo(ShowLabel);
