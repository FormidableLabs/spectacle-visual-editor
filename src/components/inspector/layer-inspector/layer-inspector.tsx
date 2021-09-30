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
    (currentLocation: Layer, nextLocation: Layer) => {
      setLocalElements((localElements) => {
        // Only allow movement within the same parent context in this function
        if (currentLocation.parentId !== nextLocation.parentId) {
          return localElements;
        }

        // If parentId is defined, then the element is nested
        // If it is not defined, the element is a top-level element
        if (currentLocation.parentId) {
          const parentIndex = localElements.findIndex(
            (el) => el.id === (currentLocation.parentId ?? '')
          );
          const parent = localElements[parentIndex];

          if (!parent || !Array.isArray(parent.children)) {
            return localElements;
          }

          const parentChildren = parent?.children as ConstructedDeckElement[];
          const currentIndex = parentChildren.findIndex((el) => {
            return el.id === currentLocation.id;
          });
          const nextIndex = parentChildren.findIndex((el) => {
            return el.id === nextLocation.id;
          });

          console.log(currentIndex, nextIndex);

          const reorderedElementChildren = moveArrayItem(
            parentChildren,
            currentIndex,
            nextIndex
          );

          localElements[parentIndex].children = reorderedElementChildren;
          return localElements;
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
      // if (currentLocation.parentIndex === nextLocation.index) {
      //   return;
      // }
      // setLocalElements((localElements) => {
      //   let nextLocationElements = localElements[nextLocation.index].children;
      //   let currentLocationElements: ConstructedDeckElement[];
      //   const itemInQuestion = Object.assign(
      //     {},
      //     localElements[currentLocation.index]
      //   );
      //   localElements[nextLocation.index].children = nextLocationElements;
      //   currentLocationElements = removeArrayItem(
      //     localElements,
      //     currentLocation.index
      //   );
      //   if (Array.isArray(nextLocationElements)) {
      //     nextLocationElements.push(itemInQuestion);
      //   }
      //   return currentLocationElements;
      // });
    },
    []
  );

  // Update the order with the local order
  const commitChangedOrder = useCallback(
    (dropLocation: Layer) => {
      // const elementsToUpdate =
      //   typeof dropLocation.parentIndex === 'number'
      //     ? localElements[dropLocation.parentIndex].children
      //     : localElements;
      // if (!Array.isArray(elementsToUpdate)) {
      //   return;
      // }
      // dispatch(
      //   deckSlice.actions.reorderActiveSlideElements({
      //     elementIds: elementsToUpdate.map((element) => element.id),
      //     parentId:
      //       typeof dropLocation.parentId === 'number'
      //         ? localElements[dropLocation.parentIndex].id
      //         : undefined
      //   })
      // );
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
              <LayerDragWrapper
                index={index}
                key={element.id}
                onDrag={moveElement}
                onDrop={commitChangedOrder}
                parentId={undefined}
                id={element.id}
                isContainerElement={isContainerElement}
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
  color: ${defaultTheme.scales.neutral.N9};
  font-size: 0.9em;
  font-weight: 500;
`;
