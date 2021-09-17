import React, { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { useRootSelector } from '../../../store';
import { cloneDeep } from 'lodash-es';
import { ConstructedDeckElement } from '../../../types/deck-elements';
import {
  activeSlideSelector,
  selectedElementSelector,
  deckSlice,
  hoveredEditableElementIdSelector
} from '../../../slices/deck-slice';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { isDeckElement } from '../../../util/is-deck-element';
import { DragWrapper, ElementLocation } from '../../helpers/drag-wrapper';
import { ElementCard } from './layers-element-card';
import {
  moveArrayItem,
  removeArrayItem
} from '../../../util/array-pure-function';
import { defaultTheme } from 'evergreen-ui';
import { CONTAINER_ELEMENTS } from '../../../types/deck-elements';

export const LayerInspector: FC = () => {
  const activeSlide = useRootSelector(activeSlideSelector);
  const activeSlideElements = useMemo(
    () => (activeSlide?.children || []).filter(isDeckElement),
    [activeSlide]
  );
  const [localElements, setLocalElements] = useState(activeSlideElements);
  const selectedElement = useSelector(selectedElementSelector);
  const hoveredElementId = useSelector(hoveredEditableElementIdSelector);
  const [collapsedLayers, setCollapsedLayers] = useState<Array<String>>([]);

  const dispatch = useDispatch();

  // Keep local children in sync with slide children
  useEffect(() => {
    setLocalElements(activeSlideElements);
  }, [activeSlideElements]);

  // Move a local item as its dragged
  const moveElement = useCallback(
    (currentLocation: ElementLocation, nextLocation: ElementLocation) => {
      setLocalElements((localElements) => {
        // Only allow movement within the same parent context for now
        if (currentLocation.parentIndex !== nextLocation.parentIndex) {
          return localElements;
        }

        // If parentIndex is defined, then the element is nested
        // If it is not defined, the element is a top-level element
        if (typeof currentLocation.parentIndex === 'number') {
          if (
            !Array.isArray(localElements[currentLocation.parentIndex].children)
          ) {
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

  const moveElementInside = useCallback(
    (currentLocation: ElementLocation, nextLocation: ElementLocation) => {
      if (currentLocation.parentIndex === nextLocation.index) {
        return;
      }

      setLocalElements((localElements) => {
        let nextLocationElements = localElements[nextLocation.index].children;
        let currentLocationElements: ConstructedDeckElement[];

        const itemInQuestion = Object.assign(
          {},
          localElements[currentLocation.index]
        );

        localElements[nextLocation.index].children = nextLocationElements;

        currentLocationElements = removeArrayItem(
          localElements,
          currentLocation.index
        );

        if (Array.isArray(nextLocationElements)) {
          nextLocationElements.push(itemInQuestion);
        }

        return currentLocationElements;
      });
    },
    []
  );

  // Update the order with the local order
  const commitChangedOrder = useCallback(
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
    [dispatch, localElements]
  );

  const hoverElement = useCallback(
    (id) => {
      dispatch(deckSlice.actions.editableElementHovered(id));
    },
    [dispatch]
  );

  const unhoverElement = useCallback(() => {
    dispatch(deckSlice.actions.editableElementHovered(null));
  }, [dispatch]);

  const selectElement = useCallback(
    (id) => {
      dispatch(deckSlice.actions.editableElementSelected(id));
    },
    [dispatch]
  );

  const handleExpand = useCallback((id) => {
    setCollapsedLayers((currentCollapsedLayers) => {
      if (currentCollapsedLayers.includes(id)) {
        return currentCollapsedLayers.filter((layerId) => layerId !== id);
      } else {
        return [...currentCollapsedLayers, id];
      }
    });
  }, []);

  return (
    <Container>
      <Title>Layers</Title>

      <Layers>
        <DndProvider backend={HTML5Backend}>
          {localElements.map((element, index) => {
            const isHovered = element.id === hoveredElementId;
            const isSelected = element.id === selectedElement?.id;
            const isExpanded = !collapsedLayers.includes(element.id);
            const isContainerElement = CONTAINER_ELEMENTS.includes(
              element.component
            );
            const isChildSelected =
              Array.isArray(element.children) &&
              !!element.children.find(
                (child) => child.id === selectedElement?.id
              );

            return (
              <DragWrapper
                key={element.id}
                index={index}
                type="Element"
                onDrag={moveElement}
                onDragInside={
                  isContainerElement ? moveElementInside : undefined
                }
                onDragOutside={isContainerElement ? () => {} : undefined}
                onDrop={commitChangedOrder}
                orientation="vertical"
              >
                <ElementCard
                  element={element}
                  isHovered={isHovered}
                  isSelected={isSelected}
                  isExpanded={isExpanded}
                  isParentSelected={!isExpanded && isChildSelected}
                  handleExpand={() => handleExpand(element.id)}
                  onClick={() => selectElement(element.id)}
                  onMouseEnter={() => hoverElement(element.id)}
                  onMouseLeave={unhoverElement}
                />
                {isExpanded &&
                  Array.isArray(element.children) &&
                  element.children.map((childElement, childIndex) => (
                    <DragWrapper
                      key={childElement.id}
                      index={childIndex}
                      parentIndex={index}
                      type="Element"
                      onDrag={moveElement}
                      onDrop={commitChangedOrder}
                      orientation="vertical"
                    >
                      <ElementCard
                        element={childElement}
                        isHovered={childElement.id === hoveredElementId}
                        isSelected={childElement.id === selectedElement?.id}
                        isParentSelected={isSelected}
                        isChildElement
                        onClick={() => selectElement(childElement.id)}
                        onMouseEnter={() => hoverElement(childElement.id)}
                        onMouseLeave={unhoverElement}
                      />
                    </DragWrapper>
                  ))}
              </DragWrapper>
            );
          })}
        </DndProvider>
      </Layers>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Layers = styled.div`
  flex: 1;
  overflow: auto;
`;

const Title = styled.div`
  padding: 10px;
  color: ${defaultTheme.scales.neutral.N9};
  font-size: 0.9em;
  font-weight: 500;
`;
