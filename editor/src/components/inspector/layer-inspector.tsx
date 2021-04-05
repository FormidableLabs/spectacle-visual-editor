import React from 'react';
import { useRootSelector } from '../../store';
import { activeSlideSelector, deckSlice } from '../../slices/deck-slice';
import { Pane } from './inspector-styles';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';

export const LayerInspector: React.FC = () => {
  const activeSlide = useRootSelector(activeSlideSelector);
  const activeSlideChildren = React.useMemo(() => activeSlide?.children || [], [
    activeSlide
  ]);
  const [localChildren, setLocalChildren] = React.useState(activeSlideChildren);
  const dispatch = useDispatch();

  // Keep local children in sync with slide children
  React.useEffect(() => {
    setLocalChildren(activeSlideChildren);
  }, [activeSlideChildren]);

  // Move a local item as its dragged.
  // S TODO: Remove this duplicated logic
  const moveItem = React.useCallback((dragIndex, hoverIndex) => {
    setLocalChildren((items) => {
      const clonedItems = [...items];
      const dragItem = items[dragIndex];

      clonedItems.splice(dragIndex, 1);
      clonedItems.splice(hoverIndex, 0, dragItem);

      return clonedItems;
    });
  }, []);

  // Commit changes
  const commitChangedOrder = React.useCallback(() => {
    const currentIds = activeSlideChildren?.map((el) => el?.id) || [];
    const newIds = localChildren?.map((el) => el?.id) || [];

    if (currentIds.join(',') !== newIds.join(',')) {
      dispatch(deckSlice.actions.reorderActiveSlideElements(newIds));
    }
  }, [activeSlideChildren, dispatch, localChildren]);

  return (
    <Pane>
      <DndProvider backend={HTML5Backend}>
        {localChildren.map((el, idx) => {
          return (
            <ElDragWrapper
              key={el.id}
              id={el.id}
              index={idx}
              onDrop={commitChangedOrder}
              moveItem={moveItem}
            >
              {el.id}
            </ElDragWrapper>
          );
        })}
      </DndProvider>
    </Pane>
  );
};

const ElDragWrapper: React.FC<{
  id: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onDrop: () => void;
}> = ({ id, index, moveItem, onDrop, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'Element',

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
      moveItem(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Element',
    item: () => {
      return { id, index };
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
