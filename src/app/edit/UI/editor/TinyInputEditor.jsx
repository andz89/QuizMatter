"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Strike from "@tiptap/extension-strike";
import { useEffect, useState } from "react";

import { HiBold, HiItalic, HiUnderline, HiListBullet } from "react-icons/hi2";

export default function TinyQuestionEditor({
  optionDetails,
  value = "",
  onChange,
  index,
  setActiveEditor,
  inputFrom,
  setDeleteOptionId,
}) {
  let data = {
    option_id: optionDetails?.option_id,
    question_id: optionDetails?.question_id,
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },

        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),

      Underline,
      Highlight,
      Superscript,
      Subscript,
      Strike,
    ],

    content: value,

    editorProps: {
      attributes: {
        class:
          "min-w-10   min-h-[10px] focus:outline-none text-slate-700 leading-relaxed [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded",
      },
    },
    onFocus: ({ editor }) => {
      setActiveEditor?.(editor);
      setDeleteOptionId?.(data);
    },
    onBlur: () => {
      setDeleteOptionId?.({});
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="flex items-start  ">
      {inputFrom === "question" && (
        <span
          className="
            text-slate-400
            font-semibold
            mr-1
            select-none
          "
        >
          {index ? index + "." : ""}
        </span>
      )}
      <div className="w-full">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
