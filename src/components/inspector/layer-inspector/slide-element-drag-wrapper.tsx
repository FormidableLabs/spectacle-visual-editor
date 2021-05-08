import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

export interface ElementLocation {
  index: number;
  parentIndex?: number;
}

interface Props extends ElementLocation {
  onDrag: (
    dragLocation: ElementLocation,
    hoverLocation: ElementLocation
  ) => void;
  onDrop: () => void;
}

/**
 * Element drag wrapper, used to wrap DnD functionality
 */
export const SlideElementDragWrapper: React.FC<Props> = ({
  children,
  index,
  onDrag,
  onDrop,
  parentIndex
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'Element',

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },

    hover(item: ElementLocation, monitor) {
      if (!ref.current) {
        return;
      }

      // Don't replace items with themselves
      if (item.parentIndex === parentIndex && item.index === index) {
        return;
      }

      // If parentIndex is undefined, then it is a top-level element
      // Don't allow drag interactions between a top-level element and its own children
      if (
        typeof item.parentIndex === 'undefined' &&
        item.index === parentIndex
      ) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

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

      // Time to actually perform the action
      onDrag(item, { parentIndex, index });

      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Element',

    item: (): ElementLocation => {
      return { parentIndex, index };
    },

    end() {
      onDrop();
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0.2 : 1;
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
