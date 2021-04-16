import React from 'react';
import { useRootSelector } from '../../../store';
import useOnClickOutside from 'react-cool-onclickoutside';
import { DeckElement } from '../../../types/deck-elements';
import { activeSlideSelector, deckSlice } from '../../../slices/deck-slice';
import { Pane } from '../inspector-styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { isDeckElement } from '../../../util/is-deck-element';
import { SlideElementDragWrapper } from './slide-element-drag-wrapper';
import { ElementCard } from './layers-element-card';
import styled from 'styled-components';
import { swapArrayItems } from '../../../util/swap-array-items';

const reorderSlideElements = (
  currentElements: DeckElement[],
  nextElements: DeckElement[],
  dispatch: React.Dispatch<{ payload: string[]; type: string }>
) => {
  const currentIds = currentElements.map((el) => el?.id) || [];
  const newIds = nextElements.map((el) => el?.id) || [];

  if (currentIds.join(',') !== newIds.join(',')) {
    dispatch(deckSlice.actions.reorderActiveSlideElements(newIds));
  }
};

export const LayerInspector: React.FC = () => {
  const activeSlide = useRootSelector(activeSlideSelector);
  const activeSlideChildren = React.useMemo(
    () => (activeSlide?.children || []).filter(isDeckElement),
    [activeSlide]
  );
  const [localChildren, setLocalChildren] = React.useState(activeSlideChildren);
  const [activeElementId, setActiveElementId] = React.useState<null | string>(
    null
  );
  const containerRef = useOnClickOutside(() => {
    setActiveElementId(null);
  });
  const dispatch = useDispatch();

  // Keep local children in sync with slide children
  React.useEffect(() => {
    setLocalChildren(activeSlideChildren);
  }, [activeSlideChildren]);

  // Move a local item as its dragged
  const moveItem = React.useCallback(
    (currentIndex: number, nextIndex: number) => {
      setLocalChildren((items) =>
        swapArrayItems(items, currentIndex, nextIndex)
      );
    },
    []
  );

  // Update the order with the local order
  const commitChangedOrder = React.useCallback(() => {
    reorderSlideElements(activeSlideChildren, localChildren, dispatch);
  }, [activeSlideChildren, dispatch, localChildren]);

  // Commit the movement of an item immediately
  const moveItemAndCommit = React.useCallback(
    (currentIndex: number, nextIndex: number) => {
      const swappedItems = swapArrayItems(
        localChildren,
        currentIndex,
        nextIndex
      );
      reorderSlideElements(activeSlideChildren, swappedItems, dispatch);
    },
    [activeSlideChildren, dispatch, localChildren]
  );

  return (
    <Pane>
      <GridContainer ref={containerRef}>
        <DndProvider backend={HTML5Backend}>
          {localChildren.map((el, idx) => (
            <SlideElementDragWrapper
              key={el.id}
              id={el.id}
              index={idx}
              onDrop={commitChangedOrder}
              onDrag={moveItem}
            >
              <ElementCard
                element={el}
                isActive={el.id === activeElementId}
                onMouseDown={() => setActiveElementId(el.id)}
                onMoveUpClick={() => moveItemAndCommit(idx, idx - 1)}
                onMoveDownClick={() => moveItemAndCommit(idx, idx + 1)}
                showMoveUpButton={idx - 1 > -1}
                showMoveDownButton={idx + 1 < localChildren.length}
              />
            </SlideElementDragWrapper>
          ))}
        </DndProvider>
      </GridContainer>
    </Pane>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-row-gap: 10px;
`;
