import React, { useEffect } from 'react';
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
  onDrop: (dropLocation: ElementLocation) => void;
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

    hover(draggedItem: ElementLocation, monitor) {
      if (!ref.current) {
        return;
      }

      const hoverTarget: ElementLocation = { index, parentIndex };

      // Don't allow an item to drop on itself
      // Don't allow nested elements to interact outside its parent context
      if (
        (draggedItem.parentIndex === hoverTarget.parentIndex &&
          draggedItem.index === hoverTarget.index) ||
        draggedItem.parentIndex !== hoverTarget.parentIndex
      ) {
        return;
      }

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
      if (
        draggedItem.index < hoverTarget.index &&
        hoverClientY < hoverMiddleY
      ) {
        return;
      }

      // Dragging upwards
      if (
        draggedItem.index > hoverTarget.index &&
        hoverClientY > hoverMiddleY
      ) {
        return;
      }

      // Time to actually perform the action
      onDrag(draggedItem, hoverTarget);
      draggedItem.index = hoverTarget.index;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Element',

    item: (): ElementLocation => {
      return { parentIndex, index };
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
