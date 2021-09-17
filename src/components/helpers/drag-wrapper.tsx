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
  onDragInside?: (
    dragLocation: ElementLocation,
    hoverLocation: ElementLocation
  ) => void;
  onDragOutside?: (
    dragLocation: ElementLocation,
    hoverLocation: ElementLocation
  ) => void;
  orientation: 'horizontal' | 'vertical';
}

export const DragWrapper: React.FC<Props> = ({
  children,
  index,
  parentIndex,
  type,
  onDrag,
  onDrop,
  onDragInside,
  onDragOutside,
  orientation
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInserable = !!(
    onDragInside !== undefined && onDragOutside !== undefined
  );

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

      // Don't allow nested elements to interact with non-insertable elements outside their parent context
      if (parentIndex !== dragParent && !isInserable) {
        return;
      }

      // Get bounding rectangle of hovered item
      const hoveredItemRect = ref.current?.getBoundingClientRect();

      let didInsert = false;
      if (isInserable) {
        // Drag inside/outside of parent element
        // Calculate position past which an item must be dragged to be allowed inside
        const verticalDragThreshold = hoveredItemRect.height / 4;
        const horizontalDragThreshold = hoveredItemRect.width / 4;

        // Get position of pointer on screen
        const pointerOffset = monitor.getClientOffset();
        if (!pointerOffset) return;

        let isWithinThreshold: boolean;
        if (orientation === 'horizontal') {
          isWithinThreshold =
            pointerOffset.x < hoveredItemRect.right - horizontalDragThreshold ||
            pointerOffset.y > hoveredItemRect.top + horizontalDragThreshold;
        } else {
          isWithinThreshold =
            pointerOffset.y < hoveredItemRect.bottom - verticalDragThreshold ||
            pointerOffset.y > hoveredItemRect.top + verticalDragThreshold;
        }

        if (isWithinThreshold) {
          !!onDragInside &&
            onDragInside(
              { index: dragIndex, parentIndex: item.parentIndex },
              { index: hoverIndex, parentIndex }
            );
          didInsert = true;
        }
      }

      if (!didInsert) {
        // Calculate middle position of item being hovered
        const dropThreshold =
          orientation === 'horizontal'
            ? (hoveredItemRect.right + hoveredItemRect.left) / 2
            : (hoveredItemRect.bottom + hoveredItemRect.top) / 2;
        // Get position of pointer on screen
        const pointerOffset = monitor.getClientOffset();
        // Calculate relevant position of pointer
        const pointerPosition =
          (orientation === 'horizontal'
            ? pointerOffset?.x
            : pointerOffset?.y) ?? 0;

        // Only move items when the pointer has passed the dropThreshold (50% of item's width/height)
        // Dragging right/down
        if (dragIndex < hoverIndex && pointerPosition < dropThreshold) return;
        // Dragging left/up
        if (dragIndex > hoverIndex && pointerPosition > dropThreshold) return;

        // Time to actually perform the action
        onDrag(
          { index: dragIndex, parentIndex: item.parentIndex },
          { index: hoverIndex, parentIndex }
        );

        item.index = hoverIndex;
      }
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
