import React from "react";

import { useQuizStore } from "../../store/QuizStore";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
function DragOptions({ questionId = {}, lists, children, type }) {
  const handleQuestionDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const sortedQuestions = [...lists].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );

    const oldIndex = sortedQuestions.findIndex(
      (q) => String(q.question_id) === String(active.id),
    );

    const newIndex = sortedQuestions.findIndex(
      (q) => String(q.question_id) === String(over.id),
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const movedQuestions = arrayMove(sortedQuestions, oldIndex, newIndex);

    const reordered = movedQuestions.map((q, index) => {
      const newOrder = index + 1;
      const orderChanged = q.order !== newOrder;

      return {
        ...q,
        order: newOrder,
        isDirty: q.isDirty || orderChanged,
        dirtyFields: {
          ...(q.dirtyFields || {}),
          ...(orderChanged && { order: true }),
        },
      };
    });

    useQuizStore.setState({
      questions: reordered,
    });
  };
  const handleOptionDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = lists.findIndex(
      (o) => String(o.option_id) === String(active.id),
    );

    const newIndex = lists.findIndex(
      (o) => String(o.option_id) === String(over.id),
    );

    const newItems = arrayMove(lists, oldIndex, newIndex);

    // ✅ build fast lookup map
    const orderMap = new Map(
      newItems.map((item, index) => [item.option_id, index]),
    );

    // ✅ update ONLY this question’s options
    useQuizStore.setState((state) => ({
      options: state.options.map((opt) => {
        if (opt.question_id !== questionId) return opt;

        const newOrder = orderMap.get(opt.option_id);

        // optional: avoid unnecessary updates
        if (newOrder === undefined || newOrder === opt.order) return opt;

        return {
          ...opt,
          order: newOrder,
          isDirty: true,
          dirtyFields: {
            ...(opt.dirtyFields || {}),
            order: true, // ✅ correct
          },
        };
      }),
    }));
  };
  const handleDragEnd =
    type === "question" ? handleQuestionDragEnd : handleOptionDragEnd;
  return (
    <>
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={
            type === "question"
              ? lists.map((q) => q.question_id)
              : lists.map((o) => o.option_id)
          }
          strategy={verticalListSortingStrategy}
        >
          {" "}
          {children}
        </SortableContext>
      </DndContext>
    </>
  );
}

export default React.memo(DragOptions);
