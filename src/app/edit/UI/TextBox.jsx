import React, { useState, useEffect } from "react";
import { useQuizStore } from "./store/QuizStore";
import TinyInputEditor from "./editor/TinyInputEditor";

const TextBox = ({ id, setActiveEditor }) => {
  const question = useQuizStore((state) =>
    state.questions.find((q) => q.question_id === id),
  );

  const updateTitle = useQuizStore((state) => state.updateTitle);
  const updateDescription = useQuizStore((state) => state.updateDescription);

  const [localTitle, setLocalTitle] = useState(() => question?.title || "");

  const [localDescription, setLocalDescription] = useState(
    () => question?.description || "",
  );

  useEffect(() => {
    setLocalTitle(question?.title || "");
    setLocalDescription(question?.description || "");
  }, [id]);

  useEffect(() => {
    if (!question) return;

    if (localTitle === (question.title || "")) return;

    const timer = setTimeout(() => {
      updateTitle(id, localTitle);
    }, 500);

    return () => clearTimeout(timer);
  }, [localTitle, id, question, updateTitle]);
  useEffect(() => {
    if (!question) return;

    if (localDescription === (question.description || "")) return;

    const timer = setTimeout(() => {
      updateDescription(id, localDescription);
    }, 500);

    return () => clearTimeout(timer);
  }, [localDescription, id, question, updateDescription]);
  if (!question) return null;

  return (
    <>
      <div>
        <label className="text-gray-600 font-bold">Title:</label>
        <div className="bg-gray-50 border-b  border-gray-300 p-2   w-full ">
          <TinyInputEditor
            placeholder="Title"
            value={localTitle}
            inputFrom="textbox"
            onChange={setLocalTitle}
            setActiveEditor={setActiveEditor}
          />
        </div>
      </div>
      <div>
        <label className="text-gray-600   block font-bold">Description:</label>
        <div className="bg-gray-50 border-b  border-gray-300 p-2   w-full ">
          <TinyInputEditor
            placeholder="Description"
            value={localDescription}
            inputFrom="textbox"
            onChange={setLocalDescription}
            setActiveEditor={setActiveEditor}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(TextBox);
