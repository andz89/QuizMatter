import React from "react";

import { useQuizStore } from "../../store/QuizStore";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
function DragOptions({ questionId, questionOptions, children }) {
  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (!over || active.id === over.id) return;

          const oldIndex = questionOptions.findIndex(
            (o) => o.option_id === active.id,
          );

          const newIndex = questionOptions.findIndex(
            (o) => o.option_id === over.id,
          );

          const newItems = arrayMove(questionOptions, oldIndex, newIndex);

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
        }}
      >
        <SortableContext
          items={questionOptions.map((o) => o.option_id)}
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
