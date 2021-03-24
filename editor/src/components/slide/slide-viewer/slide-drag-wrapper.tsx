import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

/**
 * Slides in the Timeline can be dragged to reorder the slides in the deck.
 * This component contains the logic needed for DnD functionality.
 *
 * - This is based off of the example in: https://react-dnd.github.io/react-dnd/examples/sortable/simple
 */

interface Props {
  index: number;
  moveItem(dragIndex: number, hoverIndex: number): void;
  onDrop(): void;
}

export const SlideDragWrapper: React.FC<Props> = ({
  children,
  index,
  moveItem,
  onDrop
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'Slide',

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },

    drop() {
      onDrop();
    },

    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get horizontal middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the left
      const hoverClientX = (clientOffset?.x || 0) - hoverBoundingRect.left;
      // Only perform the move when the mouse has crossed half of the items width
      // When dragging right, only move when the cursor is past 50%
      // When dragging left, only move when the cursor is before 50%

      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging right
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Slide',
    item: () => {
      return { id: (children as React.ReactElement).props.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ display: 'inherit', opacity }}
      data-handler-id={handlerId}
    >
      {children}
    </div>
  );
};
