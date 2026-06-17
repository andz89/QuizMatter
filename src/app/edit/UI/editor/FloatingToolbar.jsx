"use client";

import { HiBold, HiItalic, HiUnderline, HiListBullet } from "react-icons/hi2";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
export default function FloatingToolbar({ editor }) {
  //   if (!editor) return null;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const disabled = !editor;

  const buttonClass = (active) =>
    `
    h-8 w-8
    flex items-center justify-center
    rounded-md
    transition-all
    border
    text-sm

    ${
      active
        ? "bg-slate-500 text-white border-slate-500"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
    }
  `;

  return (
    <div
      className="
        sticky top-0 z-50
        
        flex flex-wrap items-center gap-2
        px-3 py-2
        rounded 
        border border-slate-200
        bg-white/90 backdrop-blur
        shadow-sm
      "
    >
      <div className="mx-auto flex items-center  gap-1">
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={buttonClass(false)}
          >
            😀
          </button>

          {showEmojiPicker && (
            <div className="absolute top-10 left-0 z-50">
              <EmojiPicker
                width={350}
                height={500}
                onEmojiClick={(emojiData) => {
                  editor?.chain().focus().insertContent(emojiData.emoji).run();

                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>

        <button
          disabled={disabled}
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor?.isActive("bold"))}
        >
          <HiBold size={16} />
        </button>

        <button
          disabled={disabled}
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor?.isActive("italic"))}
        >
          <HiItalic size={16} />
        </button>

        <button
          disabled={disabled}
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor?.isActive("underline"))}
        >
          <HiUnderline size={16} />
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor?.isActive("bulletList"))}
        >
          <HiListBullet size={16} />
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={buttonClass(editor?.isActive("highlight"))}
        >
          H
        </button>

        <button
          disabled={disabled}
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={buttonClass(editor?.isActive("superscript"))}
        >
          X²
        </button>

        <button
          disabled={disabled}
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={buttonClass(editor?.isActive("subscript"))}
        >
          X₂
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor?.isActive("strike"))}
        >
          <span className="line-through">S</span>
        </button>
      </div>
    </div>
  );
}
