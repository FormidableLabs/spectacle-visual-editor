import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

/**
 * Slides in the Timeline can be dragged to reorder the slides in the deck.
 * This component contains the logic needed for DnD functionality.
 *
 * - This is based off of the example in: https://react-dnd.github.io/react-dnd/examples/sortable/simple
 */

export interface ElementLocation {
  index: number;
  parentIndex?: number;
}

interface Props extends ElementLocation {
  type: 'Slide' | 'Element';
  onDrag: (
    dragLocation: ElementLocation,
    hoverLocation: ElementLocation
  ) => void;
  onDrop: (dropLocation: ElementLocation) => void;
  orientation: 'horizontal' | 'vertical';
}

export const DragWrapper: React.FC<Props> = ({
  children,
  index,
  parentIndex,
  type,
  onDrag,
  onDrop,
  orientation
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: type,

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },

    hover(item: { index: number; parentIndex: number }, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const dragParent = item.parentIndex;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      // Don't allow nested elements to interact outside its parent context
      if (parentIndex !== dragParent) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get horizontal middle
      const hoverMiddlePosition =
        orientation === 'horizontal'
          ? (hoverBoundingRect.right - hoverBoundingRect.left) / 2
          : (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const pointerOffset = monitor.getClientOffset();
      // Get pixels to the left
      const hoverClientPosition =
        orientation === 'horizontal'
          ? (pointerOffset?.x || 0) - hoverBoundingRect.left
          : (pointerOffset?.y || 0) - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items width
      // When dragging right, only move when the cursor is past 50%
      // When dragging left, only move when the cursor is before 50%

      // Dragging right
      if (dragIndex < hoverIndex && hoverClientPosition < hoverMiddlePosition) {
        return;
      }

      // Dragging right
      if (dragIndex > hoverIndex && hoverClientPosition > hoverMiddlePosition) {
        return;
      }

      // Time to actually perform the action
      onDrag(
        { index: dragIndex, parentIndex: item.parentIndex },
        { index: hoverIndex, parentIndex }
      );

      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type,

    item: () => {
      return {
        id: (children as React.ReactElement).props?.id,
        index,
        parentIndex
      };
    },

    end(dropLocation: ElementLocation) {
      onDrop(dropLocation);
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0.2 : 1;
  drag(drop(ref));

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('is-dragging');
    } else {
      document.body.classList.remove('is-dragging');
    }

    return () => {
      document.body.classList.remove('is-dragging');
    };
  }, [isDragging]);

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
