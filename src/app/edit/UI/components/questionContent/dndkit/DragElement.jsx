import { useSortable } from "@dnd-kit/sortable";

function SortableOption({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} className="w-full">
      {children({
        attributes,
        listeners,
      })}
    </div>
  );
}

export default SortableOption;
