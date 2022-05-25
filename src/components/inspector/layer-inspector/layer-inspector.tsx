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
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  PlaceholderRender
} from '@minoru/react-dnd-treeview';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { isDeckElement } from '../../../util/is-deck-element';
import { LayerDragWrapper, Layer } from '../../helpers/layer-drag-wrapper';
import {
  ElementCard,
  ElementCardTree,
  ElementCardDisplay
} from './layers-element-card';
import { moveArrayItem } from '../../../util/move-array-item';
import { defaultTheme } from 'evergreen-ui';
import { CONTAINER_ELEMENTS } from '../../../types/deck-elements';

type TreeNode = {
  id: any;
  parent: any;
  text: string;
  droppable?: boolean;
  data?: { [key: string]: any };
};

type OptionProps = {
  depth: number;
  isOpen: boolean;
  isDragging: boolean;
  onToggle: () => void;
};

const isString = (val: any) => typeof val === 'string' || val instanceof String;

const convertSlideToTreeData = (slide: ConstructedDeckElement) => {
  const treeData: TreeNode[] = [];
  const { children, id } = slide;
  if (!(children && children.length) || isString(children)) {
    // quick return if no children or children is a string
    return treeData;
  }

  const recursivelyCheckElement = (
    element: string | ConstructedDeckElement,
    parent: string
  ) => {
    if (isString(element)) {
      return;
    }

    const { component, id, children } = element as ConstructedDeckElement;

    const droppable = CONTAINER_ELEMENTS.includes(component);
    const text = component;
    const data = { element };
    treeData.push({ id, parent, droppable, text, data });

    if (children && Array.isArray(children)) {
      (children as ConstructedDeckElement[]).forEach((el) => {
        recursivelyCheckElement(el, id);
      });
    }
  };

  (children as ConstructedDeckElement[]).forEach((el) => {
    recursivelyCheckElement(el, id);
  });

  return treeData;
};

const convertTreeDataToSlide = (
  treeData: TreeNode[],
  activeSlide: ConstructedDeckElement
) => {
  const slide: ConstructedDeckElement = { ...activeSlide, children: [] };
  const groupedByParent: { [key: string]: TreeNode[] } = treeData.reduce(
    (acc, curr) => {
      const clonedAcc = { ...acc } as { [key: string]: any };
      const { parent: parentId } = curr;
      if (!clonedAcc[parentId]) {
        clonedAcc[parentId] = [];
      }
      clonedAcc[parentId].push(curr);
      return clonedAcc;
    },
    {}
  );

  const recursiveFindChildren = (parent: ConstructedDeckElement): void => {
    const parentID = parent.id;
    if (groupedByParent[parentID]) {
      parent.children = [];
      groupedByParent[parentID].forEach((el) => {
        const { element } = el?.data || {};
        if (element) {
          // Recursively find children
          recursiveFindChildren(element);
          // Attach to parent
          (parent.children as ConstructedDeckElement[]).push(element);
        }
      });
    }
  };

  // Initial children (root)
  recursiveFindChildren(slide);

  return slide;
};

const deconstructSlide = (slide: ConstructedDeckElement) => {
  const activeSlideChildren: string[] = [];
  const elements: { [key: string]: string[] | undefined } = {};

  const checkChildren = (element: ConstructedDeckElement) => {
    const { id, children, component } = element;
    if (CONTAINER_ELEMENTS.includes(component)) {
      const childrenIds: string[] = [];
      if (children && Array.isArray(children)) {
        children.forEach((child) => {
          childrenIds.push(child.id);
          checkChildren(child);
        });
      }
      elements[id] = childrenIds.length ? childrenIds : undefined;
    }
  };

  const slideChildren = slide.children;
  if (slideChildren && Array.isArray(slideChildren)) {
    slideChildren.forEach((element) => {
      checkChildren(element);
      activeSlideChildren.push(element.id);
    });
  }

  return { activeSlideChildren, elements };
};

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

  // tree
  const treeRoot = useMemo(() => activeSlide?.id || '', [activeSlide]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // Keep local children in sync with slide children
  useEffect(() => {
    if (activeSlide) {
      setTreeData(convertSlideToTreeData(activeSlide));
    }
  }, [activeSlide]);

  const handleDrop = useCallback(
    (newTreeData: TreeNode[]) => {
      if (activeSlide) {
        setTreeData(newTreeData);
        const slideData = convertTreeDataToSlide(newTreeData, activeSlide);
        const { activeSlideChildren, elements } = deconstructSlide(slideData);
        dispatch(
          deckSlice.actions.reorderElements({ activeSlideChildren, elements })
        );
      }
    },
    [dispatch, activeSlide]
  );

  const checkIfParentSelected = useCallback(
    (initialNode: TreeNode, depth: number) => {
      let traversalNode = initialNode as TreeNode | undefined;
      let depthIndex = 0;
      let isParentSelected = false;
      while (depthIndex < depth && !isParentSelected) {
        // Check if parent is selected
        isParentSelected =
          isParentSelected || traversalNode?.parent === selectedElement?.id;

        // Exit early if parent selected
        if (isParentSelected) {
          break;
        }

        // Find next parent
        traversalNode = treeData.find(({ id }) => id === traversalNode?.parent);

        // Exit if parent node not found
        if (!traversalNode) {
          break;
        }

        depthIndex++;
      }

      return isParentSelected;
    },
    [treeData, selectedElement]
  );

  const renderTreeNode = (node: TreeNode, props: OptionProps) => {
    const { depth, isOpen, isDragging, onToggle } = props;
    const { element } = node?.data || {};
    const isHovered = element.id === hoveredElementId;
    const isSelected = element.id === selectedElement?.id;
    const isParentSelected = checkIfParentSelected(node, depth);

    return (
      <ElementCardTree
        element={element}
        isHovered={isHovered}
        isSelected={isSelected}
        isExpanded={isOpen}
        isParentSelected={isParentSelected}
        isDragging={isDragging}
        handleExpand={onToggle}
        onClick={() => selectElement(element.id)}
        onMouseEnter={() => hoverElement(element.id)}
        onMouseLeave={unhoverElement}
        depth={depth}
      />
    );
  };

  const renderPlaceholder = (node: TreeNode, props: OptionProps) => {
    const { depth, isOpen } = props;
    const { element } = node?.data || {};
    const isSelected = element.id === selectedElement?.id;
    const isParentSelected = checkIfParentSelected(node, depth);

    return (
      <ElementCardDisplay
        element={element}
        depth={depth}
        isSelected={isSelected}
        isParentSelected={isParentSelected}
        isExpanded={isOpen}
      />
    );
  };

  return (
    <Container>
      <Title>Layers</Title>
      <Layers>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <TreeWrap>
            <Tree
              tree={treeData}
              rootId={treeRoot}
              render={renderTreeNode}
              placeholderRender={
                renderPlaceholder as PlaceholderRender<{ [key: string]: any }>
              }
              onDrop={handleDrop}
              sort={false}
              insertDroppableFirst={false}
              initialOpen
              canDrop={(tree, { dragSource, dropTargetId }) => {
                if (dragSource?.parent === dropTargetId) {
                  return true;
                }
              }}
              dropTargetOffset={10}
            />
          </TreeWrap>
        </DndProvider>
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
  color: ${defaultTheme.colors.muted};
  font-size: 0.9em;
  font-weight: 500;
`;

const TreeWrap = styled.div`
  position: relative;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    > li {
      padding: 0;
    }
  }
`;
