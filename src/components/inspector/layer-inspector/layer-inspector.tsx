import React, { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  PlaceholderRender
} from '@minoru/react-dnd-treeview';
import { defaultTheme } from 'evergreen-ui';
import styled from 'styled-components';
import { ElementCard, ElementCardDisplay } from './layers-element-card';
import { useRootSelector } from '../../../store';
import {
  activeSlideSelector,
  constructedSlideTemplateSelector,
  slideTemplateOpenSelector,
  selectedElementSelector,
  deckSlice,
  hoveredEditableElementIdSelector
} from '../../../slices/deck-slice';
import {
  CONTAINER_ELEMENTS,
  ALL_CONTAINER_ELEMENTS,
  ConstructedDeckElement
} from '../../../types/deck-elements';

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
      const clonedAcc = { ...acc } as { [key: string]: TreeNode[] };
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
    const { id: parentID, component } = parent;
    if (ALL_CONTAINER_ELEMENTS.includes(component)) {
      parent.children = [];

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
    if (ALL_CONTAINER_ELEMENTS.includes(component)) {
      const childrenIds: string[] = [];
      if (children && Array.isArray(children)) {
        children.forEach((child) => {
          childrenIds.push(child.id);
          checkChildren(child);
        });
      }
      elements[id] = childrenIds;
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
  const dispatch = useDispatch();

  const activeSlideJson = useRootSelector(activeSlideSelector);
  const slideTemplateJson = useRootSelector(constructedSlideTemplateSelector);
  const slideTemplateOpen = useSelector(slideTemplateOpenSelector);
  const activeSlide = useMemo(
    () => (slideTemplateOpen ? slideTemplateJson : activeSlideJson),
    [activeSlideJson, slideTemplateJson, slideTemplateOpen]
  );

  const selectedElement = useSelector(selectedElementSelector);
  const hoveredElementId = useSelector(hoveredEditableElementIdSelector);

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

  const treeRoot = useMemo(() => activeSlide?.id || '', [activeSlide]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [renderCount, setRenderCount] = useState<number>(0);

  // Keep local children in sync with slide children
  useEffect(() => {
    if (activeSlide) {
      setTreeData(convertSlideToTreeData(activeSlide));
    }
    setRenderCount((curr) => curr + 1);
  }, [activeSlide, setRenderCount]);

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
      <ElementCard
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
              key={renderCount} // arbitrary value to force rerenders otherwise initialOpen doesn't work
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
