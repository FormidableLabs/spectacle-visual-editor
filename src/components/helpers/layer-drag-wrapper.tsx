import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export interface Layer {
  id: string;
  parentId?: string;
}

interface Props extends Layer {
  index: number;
  onDrag: (dragLayer: Layer, hoverLayer: Layer) => void;
  onDrop: (dropLayer: Layer) => void;
  onDragInside?: (
    dragLayer: Layer,
    hoverLayer: Layer,
    fromDirection: 'top' | 'bottom'
  ) => void;
  onDragOutside?: (dragLayer: Layer, hoverLayer: Layer) => void;
  isContainerElement: boolean;
}

export const LayerDragWrapper: React.FC<Props> = ({
  children,
  index,
  id,
  parentId,
  onDrag,
  onDrop,
  onDragInside,
  onDragOutside,
  isContainerElement
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'layer',

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },

    hover(item: { id: string; parentId: string; index: number }, monitor) {
      if (!ref.current) return;

      const dragId = item.id;
      const dragIndex = item.index;
      const dragParentId = item.parentId;
      const hoverId = id;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (
        dragId === hoverId ||
        (dragIndex === hoverIndex && dragParentId === parentId)
      )
        return;

      // This item is a container, and the item being dragged over it does not have a parent
      const canBeInserted = isContainerElement && !dragParentId;
      var wasInserted = false;

      // Element has a parent, but is being dragged over an element which is not its parent
      const canBeRemoved =
        dragParentId && dragParentId !== id && dragParentId !== parentId;
      var wasRemoved = false;

      // Don't allow nested elements to interact with non-insertable elements outside their parent context
      if (parentId !== dragParentId && !canBeRemoved) {
        return;
      }

      // Get bounding rectangle of hovered item
      const hoveredItemRect = ref.current?.getBoundingClientRect();

      // Get position of pointer on screen
      const pointerOffset = monitor.getClientOffset();

      if (canBeRemoved) {
        onDragOutside &&
          onDragOutside(
            { id: dragId, parentId: item.parentId },
            { id: hoverId, parentId }
          );
        wasRemoved = true;
      }

      if (!wasRemoved && canBeInserted) {
        // Drag into element
        // Calculate position past which an item must be dragged to be allowed inside
        const dragThreshold = hoveredItemRect.height / 4;

        if (!pointerOffset) return;

        let isWithinThreshold =
          pointerOffset.y < hoveredItemRect.bottom - dragThreshold ||
          pointerOffset.y > hoveredItemRect.top + dragThreshold;

        if (isWithinThreshold) {
          !!onDragInside &&
            onDragInside(
              { id: dragId, parentId: item.parentId },
              { id: hoverId, parentId },
              dragIndex < hoverIndex ? 'top' : 'bottom'
            );
          wasInserted = true;
        }
      }

      if (!wasInserted && !wasRemoved) {
        // Calculate middle position of item being hovered
        const dropThreshold =
          (hoveredItemRect.bottom + hoveredItemRect.top) / 2;

        // Calculate relevant position of pointer
        const pointerPosition = pointerOffset?.y ?? 0;

        // Only move items when the pointer has passed the dropThreshold (50% of item's width/height)
        // Dragging right/down
        if (dragIndex < hoverIndex && pointerPosition < dropThreshold) return;
        // Dragging left/up
        if (dragIndex > hoverIndex && pointerPosition > dropThreshold) return;

        // Time to actually perform the action
        onDrag({ id: dragId, parentId: dragParentId }, { id, parentId });
        item.index = hoverIndex;
      }
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'layer',

    item: () => {
      return {
        id: id,
        index,
        parentId
      };
    },

    end(dropLocation: Layer) {
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
