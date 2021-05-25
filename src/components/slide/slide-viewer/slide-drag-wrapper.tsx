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

interface Props {
  index: number;
  parentIndex?: number;
  moveItem(dragLocation: ElementLocation, hoverLocation: ElementLocation): void;
  onDrop(dropLocation: ElementLocation): void;
  type: string;
  alignment?: 'vertical' | 'horizontal';
  draggingOpacity?: number;
}

export const SlideDragWrapper: React.FC<Props> = ({
  children,
  index,
  moveItem,
  onDrop,
  type,
  parentIndex,
  alignment,
  draggingOpacity
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
      if (!ref.current) {
        return;
      }

      const finalAlignment = alignment || 'horizontal';

      const dragIndex = item.index;
      const dragParent = item.parentIndex;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      if (parentIndex !== dragParent) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      if (finalAlignment === 'horizontal') {
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
      } else {
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
      }

      // Time to actually perform the action
      moveItem(
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

  const opacity = isDragging ? draggingOpacity || 0 : 1;
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
