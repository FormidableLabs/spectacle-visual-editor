import React from 'react';
import { useRootSelector } from '../../../store';
import useOnClickOutside from 'react-cool-onclickoutside';
import { ConstructedDeckElement } from '../../../types/deck-elements';
import { activeSlideSelector, deckSlice } from '../../../slices/deck-slice';
import { Pane } from '../inspector-styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { isDeckElement } from '../../../util/is-deck-element';
import { ElementLocation, SlideElementDragWrapper } from './slide-element-drag-wrapper';
import { ElementCard } from './layers-element-card';
import styled from 'styled-components';
import { moveArrayItem } from '../../../util/move-array-item';

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

  const reorderSlideElements = React.useCallback(
    (nextElements: ConstructedDeckElement[]) => {
      const nextIds = nextElements.map((element) => element?.id) || [];
      dispatch(deckSlice.actions.reorderActiveSlideElements(nextIds));
    },
    [dispatch]
  );

  // Keep local children in sync with slide children
  React.useEffect(() => {
    setLocalChildren(activeSlideChildren);
  }, [activeSlideChildren]);

  // Move a local item as its dragged
  const moveItem = React.useCallback(
    (currentLocation: ElementLocation, nextLocation: ElementLocation) => {
      setLocalChildren((localChildren) => {
        if (typeof currentLocation.parentIndex === 'number') {
          return localChildren;
        }

        return moveArrayItem(localChildren, currentLocation.index, nextLocation.index)
      });
    },
    []
  );

  // Update the order with the local order
  const commitChangedOrder = React.useCallback(() => {
    reorderSlideElements(localChildren);
  }, [localChildren, reorderSlideElements]);

  // Commit the movement of an item immediately
  const moveItemAndCommit = React.useCallback(
    (currentIndex: number, nextIndex: number) => {
      const swappedItems = moveArrayItem(
        localChildren,
        currentIndex,
        nextIndex
      );
      reorderSlideElements(swappedItems);
    },
    [localChildren, reorderSlideElements]
  );

  return (
    <Pane>
      <GridContainer ref={containerRef}>
        <DndProvider backend={HTML5Backend}>
          {localChildren.map((element, index) => (
            <SlideElementDragWrapper
              key={element.id}
              index={index}
              onDrop={commitChangedOrder}
              onDrag={moveItem}
            >
              <ElementCard
                element={element}
                isActive={element.id === activeElementId}
                onMouseDown={() => setActiveElementId(element.id)}
                onMoveUpClick={() => moveItemAndCommit(index, index - 1)}
                onMoveDownClick={() => moveItemAndCommit(index, index + 1)}
                showMoveUpButton={index - 1 > -1}
                showMoveDownButton={index + 1 < localChildren.length}
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
