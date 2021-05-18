import React, { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { useRootSelector } from '../../../store';
import { cloneDeep } from 'lodash-es';
import { ConstructedDeckElement } from '../../../types/deck-elements';
import {
  activeSlideSelector,
  selectedElementSelector,
  deckSlice
} from '../../../slices/deck-slice';
import { Pane } from '../inspector-styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import { isDeckElement } from '../../../util/is-deck-element';
import {
  ElementLocation,
  SlideElementDragWrapper
} from './slide-element-drag-wrapper';
import { ElementCard } from './layers-element-card';
import { moveArrayItem } from '../../../util/move-array-item';
import { defaultTheme } from 'evergreen-ui';

export const LayerInspector: FC = () => {
  const activeSlide = useRootSelector(activeSlideSelector);
  const activeSlideElements = useMemo(
    () => (activeSlide?.children || []).filter(isDeckElement),
    [activeSlide]
  );
  const [localElements, setLocalElements] = useState(activeSlideElements);
  const selectedElement = useSelector(selectedElementSelector);
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
    <>
      <GrabbingStyles />

      <Pane>
        <Title>Layers</Title>

        <DndProvider backend={HTML5Backend}>
          {localElements.map((element, index) => {
            const isSelected = element.id === selectedElement?.id;
            const isExpanded = !collapsedLayers.includes(element.id);
            const isChildSelected =
              Array.isArray(element.children) &&
              !!element.children.find(
                (child) => child.id === selectedElement?.id
              );

            return (
              <SlideElementDragWrapper
                key={element.id}
                index={index}
                onDrop={commitChangedOrder}
                onDrag={moveElement}
              >
                <ElementCard
                  element={element}
                  isSelected={isSelected}
                  isExpanded={isExpanded}
                  isParentSelected={!isExpanded && isChildSelected}
                  handleExpand={() => handleExpand(element.id)}
                  onClick={() => selectElement(element.id)}
                />
                {isExpanded &&
                  Array.isArray(element.children) &&
                  element.children.map((childElement, childIndex) => (
                    <SlideElementDragWrapper
                      key={childElement.id}
                      index={childIndex}
                      parentIndex={index}
                      onDrop={commitChangedOrder}
                      onDrag={moveElement}
                    >
                      <ElementCard
                        element={childElement}
                        isSelected={childElement.id === selectedElement?.id}
                        isParentSelected={isSelected}
                        onClick={() => selectElement(childElement.id)}
                        isChildElement
                      />
                    </SlideElementDragWrapper>
                  ))}
              </SlideElementDragWrapper>
            );
          })}
        </DndProvider>
      </Pane>
    </>
  );
};

const Title = styled.div`
  border-top: ${defaultTheme.scales.neutral.N6} 1px solid;
  padding: 10px;
  color: ${defaultTheme.scales.neutral.N9};
  font-size: 0.9em;
  font-weight: 500;
`;

export const GrabbingStyles = createGlobalStyle`
  body.is-dragging {
    &, * {
      cursor: grabbing !important;
    }
  }
`;
