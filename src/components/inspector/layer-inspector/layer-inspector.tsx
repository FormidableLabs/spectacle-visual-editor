import React from 'react';
import { useRootSelector } from '../../../store';
import useOnClickOutside from 'react-cool-onclickoutside';
import { cloneDeep } from 'lodash-es';
import { ConstructedDeckElement } from '../../../types/deck-elements';
import { activeSlideSelector, deckSlice } from '../../../slices/deck-slice';
import { Pane } from '../inspector-styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { isDeckElement } from '../../../util/is-deck-element';
import {
  ElementLocation,
  SlideElementDragWrapper
} from './slide-element-drag-wrapper';
import { ElementCard } from './layers-element-card';
import styled from 'styled-components';
import { moveArrayItem } from '../../../util/move-array-item';

export const LayerInspector: React.FC = () => {
  const activeSlide = useRootSelector(activeSlideSelector);
  const activeSlideElements = React.useMemo(
    () => (activeSlide?.children || []).filter(isDeckElement),
    [activeSlide]
  );
  const [localElements, setLocalElements] = React.useState(activeSlideElements);
  const [activeElementId, setActiveElementId] = React.useState<null | string>(
    null
  );
  const containerRef = useOnClickOutside(() => {
    setActiveElementId(null);
  });
  const dispatch = useDispatch();

  // Keep local children in sync with slide children
  React.useEffect(() => {
    setLocalElements(activeSlideElements);
  }, [activeSlideElements]);

  // Move a local item as its dragged
  const moveElement = React.useCallback(
    (currentLocation: ElementLocation, nextLocation: ElementLocation) => {
      setLocalElements((localElements) => {
        // Only allow movement within the same parent context for now
        if (currentLocation.parentIndex !== nextLocation.parentIndex) {
          return localElements;
        }

        // If parentIndex is defined, then the element is nested
        // If it is not defined, the element is a top-level element
        if (typeof currentLocation.parentIndex === 'number') {
          if (!Array.isArray(localElements[currentLocation.parentIndex].children)) {
            return localElements;
          }

          const clonedLocalElements = cloneDeep(localElements);
          const clonedElementChildren = clonedLocalElements[
            currentLocation.parentIndex
          ].children as ConstructedDeckElement[];
          const reorderedElementChildren = moveArrayItem(
            clonedElementChildren,
            currentLocation.index,
            nextLocation.index
          );

          clonedLocalElements[
            currentLocation.parentIndex
          ].children = reorderedElementChildren;
          return clonedLocalElements;
        }

        return moveArrayItem(
          localElements,
          currentLocation.index,
          nextLocation.index
        );
      });
    },
    []
  );

  // Update the order with the local order
  const commitChangedOrder = React.useCallback(
    (dropLocation: ElementLocation) => {
      const elementsToUpdate =
        typeof dropLocation.parentIndex === 'number'
          ? localElements[dropLocation.parentIndex].children
          : localElements;

      if (!Array.isArray(elementsToUpdate)) {
        return;
      }

      dispatch(
        deckSlice.actions.reorderActiveSlideElements({
          elementIds: elementsToUpdate.map((element) => element.id),
          parentId:
            typeof dropLocation.parentIndex === 'number'
              ? localElements[dropLocation.parentIndex].id
              : undefined
        })
      );
    },
    [localElements]
  );

  // Commit the movement of an item immediately
  const moveElementAndCommit = React.useCallback(
    (currentIndex: number, nextIndex: number, parentIndex?: number) => {
      const elementsToReorder =
        typeof parentIndex === 'number'
          ? localElements[parentIndex].children
          : localElements;

      if (!Array.isArray(elementsToReorder)) {
        return;
      }

      const reorderedElements = moveArrayItem(
        elementsToReorder,
        currentIndex,
        nextIndex
      );

      dispatch(
        deckSlice.actions.reorderActiveSlideElements({
          elementIds: reorderedElements.map((element) => element.id),
          parentId:
            typeof parentIndex === 'number'
              ? localElements[parentIndex].id
              : undefined
        })
      );
    },
    [localElements]
  );

  return (
    <Pane>
      <GridContainer ref={containerRef}>
        <DndProvider backend={HTML5Backend}>
          {localElements.map((element, index) => (
            <SlideElementDragWrapper
              key={element.id}
              index={index}
              onDrop={commitChangedOrder}
              onDrag={moveElement}
            >
              <ElementCard
                element={element}
                isActive={element.id === activeElementId}
                onMouseDown={() => setActiveElementId(element.id)}
                onMoveUpClick={() => moveElementAndCommit(index, index - 1)}
                onMoveDownClick={() => moveElementAndCommit(index, index + 1)}
                showMoveUpButton={index - 1 > -1}
                showMoveDownButton={index + 1 < localElements.length}
              />
              {Array.isArray(element.children) && (
                <ElementChildrenContainer>
                  {element.children.map((childElement, childIndex) => (
                    <SlideElementDragWrapper
                      key={childElement.id}
                      index={childIndex}
                      parentIndex={index}
                      onDrop={commitChangedOrder}
                      onDrag={moveElement}
                    >
                      <ElementCard
                        element={childElement}
                        isActive={childElement.id === activeElementId}
                        onMouseDown={() => setActiveElementId(childElement.id)}
                        onMoveUpClick={() =>
                          moveElementAndCommit(
                            childIndex,
                            childIndex - 1,
                            index
                          )
                        }
                        onMoveDownClick={() =>
                          moveElementAndCommit(
                            childIndex,
                            childIndex + 1,
                            index
                          )
                        }
                        showMoveUpButton={childIndex - 1 > -1}
                        showMoveDownButton={
                          childIndex + 1 <
                          (element.children as ConstructedDeckElement[]).length
                        }
                      />
                    </SlideElementDragWrapper>
                  ))}
                </ElementChildrenContainer>
              )}
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

const ElementChildrenContainer = styled.div`
  margin-left: 16px;
`;
