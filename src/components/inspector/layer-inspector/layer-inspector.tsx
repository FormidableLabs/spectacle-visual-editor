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
import { LayerDragWrapper, Layer } from '../../helpers/layer-drag-wrapper';
import { ElementCard } from './layers-element-card';
import { moveArrayItem } from '../../../util/move-array-item';
import { deprecatedDefaultTheme } from 'evergreen-ui';
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
    (currentLocation: Layer, nextLocation: Layer) => {
      setLocalElements((localElements) => {
        // Only allow movement within the same parent context in this function
        if (currentLocation.parentId !== nextLocation.parentId) {
          return localElements;
        }

        // If parentId is defined, then the element is nested
        // If it is not defined, the element is a top-level element
        if (currentLocation.parentId) {
          const clonedLocalElements = cloneDeep(localElements);
          const parentIndex = clonedLocalElements.findIndex(
            (el) => el.id === (currentLocation.parentId as string)
          );
          const parent = clonedLocalElements[parentIndex];

          if (!parent || !Array.isArray(parent.children)) {
            return clonedLocalElements;
          }

          const parentChildren = parent?.children as ConstructedDeckElement[];
          const currentIndex = parentChildren.findIndex((el) => {
            return el.id === currentLocation.id;
          });
          const nextIndex = parentChildren.findIndex((el) => {
            return el.id === nextLocation.id;
          });

          const reorderedElementChildren = moveArrayItem(
            parentChildren,
            currentIndex,
            nextIndex
          );

          clonedLocalElements[parentIndex].children = reorderedElementChildren;
          return clonedLocalElements;
        }

        const currentIndex = localElements.findIndex(
          (el) => el.id === currentLocation.id
        );
        const nextIndex = localElements.findIndex(
          (el) => el.id === nextLocation.id
        );
        return moveArrayItem(localElements, currentIndex, nextIndex);
      });
    },
    []
  );

  const moveElementInside = useCallback(
    (
      currentLocation: Layer,
      nextLocation: Layer,
      direction: 'top' | 'bottom'
    ) => {
      setLocalElements((localElements) => {
        const clonedLocalElements = cloneDeep(localElements);
        const parentIndex = clonedLocalElements.findIndex(
          (el) => el.id === nextLocation.id
        );
        const parent = clonedLocalElements[parentIndex];
        const parentChildren = parent.children;
        const itemInQuestion = clonedLocalElements.find(
          (el) => el.id === currentLocation.id
        );

        if (
          itemInQuestion === undefined ||
          parentChildren === undefined ||
          !Array.isArray(parentChildren)
        ) {
          return localElements;
        }

        if (direction === 'top') {
          (parentChildren as ConstructedDeckElement[]).unshift(itemInQuestion);
        } else if (direction === 'bottom') {
          parentChildren.push(itemInQuestion);
        }

        const x = clonedLocalElements.filter(
          (el) => el.id !== currentLocation.id
        );
        return x;
      });
    },
    []
  );

  const moveElementOutside = useCallback(
    (currentLocation: Layer, nextLocation: Layer) => {
      setLocalElements((localElements) => {
        if (currentLocation.parentId === undefined) return localElements;
        const clonedLocalElements = cloneDeep(localElements);

        const currentParentIndex = clonedLocalElements.findIndex(
          (el) => el.id === currentLocation.parentId
        );
        const nextLocationIndex = clonedLocalElements.findIndex(
          (el) => el.id === nextLocation.id
        );
        const currentParent = clonedLocalElements[currentParentIndex];
        const itemInQuestion = (currentParent.children as ConstructedDeckElement[]).find(
          (el) => el.id === currentLocation.id
        );
        if (!itemInQuestion) return localElements;
        const updatedParent = (currentParent.children as ConstructedDeckElement[]).filter(
          (el) => el.id !== currentLocation.id
        );

        clonedLocalElements[currentParentIndex].children = updatedParent;
        clonedLocalElements.splice(nextLocationIndex, 0, itemInQuestion);

        return clonedLocalElements;
      });
    },
    []
  );

  // Update the order with the local order
  const commitChangedOrder = useCallback(
    (previousParent: string | undefined, nextParent: string | undefined) => {
      // commitChangedOrder is called with a stale version of localElements.
      // Use update function to get the most recent change. Return original value.
      setLocalElements((localElements) => {
        const nextLocationIndex = localElements.findIndex(
          (el) => el.id === nextParent
        );

        // Update drop location
        const elementsToUpdate =
          typeof nextParent === 'string'
            ? localElements[nextLocationIndex].children
            : localElements;
        if (!Array.isArray(elementsToUpdate)) {
          return localElements;
        }
        dispatch(
          deckSlice.actions.reorderActiveSlideElements({
            elementIds: elementsToUpdate.map((element) => element.id),
            parentId:
              typeof nextParent === 'string'
                ? localElements[nextLocationIndex].id
                : undefined
          })
        );

        // If element has moved outside of parent, update previous parent
        if (previousParent !== nextParent) {
          const previousLocationIndex = localElements.findIndex(
            (el) => el.id === previousParent
          );

          const elementsToUpdate =
            typeof previousParent === 'string'
              ? localElements[previousLocationIndex].children
              : localElements;
          if (!Array.isArray(elementsToUpdate)) {
            return localElements;
          }
          dispatch(
            deckSlice.actions.reorderActiveSlideElements({
              elementIds: elementsToUpdate.map((element) => element.id),
              parentId:
                typeof previousParent === 'string'
                  ? localElements[previousLocationIndex].id
                  : undefined
            })
          );
        }
        return localElements;
      });
    },
    [dispatch]
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
              <LayerDragWrapper
                index={index}
                key={element.id}
                onDrag={moveElement}
                onDrop={commitChangedOrder}
                parentId={undefined}
                id={element.id}
                isContainerElement={isContainerElement}
                onDragInside={moveElementInside}
                onDragOutside={moveElementOutside}
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
                  element.children.map((childElement, childElementIndex) => (
                    <LayerDragWrapper
                      key={childElement.id}
                      index={childElementIndex}
                      parentId={element.id}
                      id={childElement.id}
                      onDrag={moveElement}
                      onDrop={commitChangedOrder}
                      isContainerElement={false}
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
                    </LayerDragWrapper>
                  ))}
              </LayerDragWrapper>
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
  color: ${deprecatedDefaultTheme.scales.neutral.N9};
  font-size: 0.9em;
  font-weight: 500;
`;
