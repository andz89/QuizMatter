import React, { useState, useEffect } from "react";
import { useQuizStore } from "../store/QuizStore";
import TinyInputEditor from "../editor/TinyInputEditor";

const TextBox = ({ q, setActiveEditor }) => {
  const question = useQuizStore((state) =>
    state.questions.find((quest) => quest.question_id === q.question_id),
  );

  const updateTitle = useQuizStore((state) => state.updateTitle);
  const updateDescription = useQuizStore((state) => state.updateDescription);

  const [localTitle, setLocalTitle] = useState(() => question?.title || "");

  const [localDescription, setLocalDescription] = useState(
    () => question?.description || "",
  );

  useEffect(() => {
    if (!question) return;

    if (question.title !== localTitle) {
      setLocalTitle(question.title || "");
    }
  }, [question?.title]);

  useEffect(() => {
    if (!question) return;

    if (question.description !== localDescription) {
      setLocalDescription(question.description || "");
    }
  }, [question?.description]);

  useEffect(() => {
    if (!question) return;

    if (localTitle === (question.title || "")) return;

    const timer = setTimeout(() => {
      updateTitle(q.question_id, localTitle);
    }, 500);

    return () => clearTimeout(timer);
  }, [localTitle, q.question_id, question, updateTitle]);

  useEffect(() => {
    if (!question) return;

    if (localDescription === (question.description || "")) return;

    const timer = setTimeout(() => {
      updateDescription(q.question_id, localDescription);
    }, 500);

    return () => clearTimeout(timer);
  }, [localDescription, q.question_id, question, updateDescription]);
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
            isQuestionNew={question.isNew}
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
