import React from 'react';
import { useRootSelector } from '../../../store';
import { activeSlideSelector, deckSlice } from '../../../slices/deck-slice';
import { Pane } from '../inspector-styles';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { isDeckElement } from '../../../util/is-deck-element';
import styled from 'styled-components';
import { swapArrayItems } from '../../../util/swap-array-items';
import { DeckElement } from '../../../types/deck-elements';
import { cloneDeep } from 'lodash-es';

type FindItem = (id: string, nodes: DeckElement[]) => DeckElement | false;
type MoveItem = (id: string, afterId: string, nodeId: string) => void;

export const LayerInspector: React.FC = () => {
  const activeSlide = useRootSelector(activeSlideSelector);
  const activeSlideChildren = React.useMemo(
    () => (activeSlide?.children || []).filter(isDeckElement),
    [activeSlide]
  );
  const [localChildren, setLocalChildren] = React.useState(activeSlideChildren);
  const dispatch = useDispatch();

  // Keep local children in sync with slide children
  React.useEffect(() => {
    setLocalChildren(activeSlideChildren);
  }, [activeSlideChildren]);

  // Move a local item as its dragged.
  const moveItem = React.useCallback((dragIndex, hoverIndex) => {
    setLocalChildren((items) => swapArrayItems(items, dragIndex, hoverIndex));
  }, []);

  // Commit changes
  const commitChangedOrder = React.useCallback(() => {
    dispatch(deckSlice.actions.setActiveSlideElements(localChildren));
  }, [dispatch, localChildren]);

  /**
   * Search for an item by ID inside a list of nodes
   */
  const __findItem: FindItem = React.useCallback<FindItem>((id, nodes) => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      if (Array.isArray(node.children)) {
        const result = __findItem(id, node.children);
        if (result) {
          return result;
        }
      }
    }

    return false;
  }, []);

  /**
   * Moving an item
   * SEE https://github.com/tamagokun/example-react-dnd-nested/blob/master/app/containers/Index.js
   */
  const __moveItem = React.useCallback<MoveItem>(
    (id, afterId, nodeId) => {
      if (id === afterId) return;

      setLocalChildren((els) => {
        const tree = cloneDeep(els);

        const removeNode = (id: string, nodes: DeckElement[]) => {
          for (const node of nodes) {
            if (node.id === id) {
              nodes.splice(nodes.indexOf(node), 1);
              return;
            }

            if (Array.isArray(node.children)) {
              removeNode(id, node.children);
            }
          }
        };

        const item = cloneDeep(__findItem(id, tree));
        if (!item) return els;

        const dest = (() => {
          if (nodeId) {
            const res = __findItem(nodeId, tree);
            if (res && Array.isArray(res.children)) {
              return res.children;
            }
          } else {
            return tree;
          }
        })();

        if (!dest) return els;

        if (!afterId) {
          removeNode(id, tree);
          dest.push(item);
        } else {
          const index = dest.indexOf(
            dest.filter((v) => v.id === afterId).shift()!
          );
          removeNode(id, tree);
          dest.splice(index, 0, item);
        }

        return tree;
      });
    },
    [__findItem]
  );

  return (
    <Pane>
      <GridContainer>
        <DndProvider backend={HTML5Backend}>
          <Tree
            nodes={localChildren}
            move={__moveItem}
            find={__findItem}
            parentId={''}
            commitChangeOrder={commitChangedOrder}
          />
        </DndProvider>
      </GridContainer>
    </Pane>
  );
};

const Tree: React.FC<{
  nodes: DeckElement[];
  move: MoveItem;
  find: FindItem;
  parentId: string;
  commitChangeOrder: () => void;
}> = ({ nodes, move, find, parentId, commitChangeOrder }) => {
  return (
    <GridContainer>
      {nodes.map((el, idx) => (
        <Leaf
          element={el}
          find={find}
          move={move}
          key={el.id}
          index={idx}
          parentId={parentId}
          commitChangeOrder={commitChangeOrder}
        />
      ))}
    </GridContainer>
  );
};

const Leaf: React.FC<{
  element: DeckElement;
  index: number;
  move: MoveItem;
  find: FindItem;
  parentId: string;
  commitChangeOrder: () => void;
}> = ({ element, move, find, index, parentId, commitChangeOrder }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'Element',

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    // canDrop: () => false,
    hover(props, monitor) {
      const { id: draggedId } = monitor.getItem();
      const overId = element.id;

      if (draggedId === overId || draggedId === parentId) return;
      if (!monitor.isOver({ shallow: true })) return;

      move(draggedId, overId, parentId);
    }
  });

  const [_, drag] = useDrag({
    type: 'Element',

    item: () => {
      return { id: element.id, index };
    },

    beginDrag() {
      return {
        id: element.id,
        parentId,
        items: element.children
      };
    },

    end() {
      commitChangeOrder();
    },

    isDragging: (monitor) => element.id === monitor.getItem().id
  });

  drag(drop(ref));

  return (
    <div>
      <div ref={ref} data-handler-id={handlerId}>
        {element.component}
      </div>
      {Array.isArray(element.children) && (
        <div style={{ paddingLeft: 20 }}>
          <Tree
            find={find}
            move={move}
            nodes={element.children}
            parentId={element.id}
            commitChangeOrder={commitChangeOrder}
          />
        </div>
      )}
    </div>
  );
};

const GridContainer = styled.div<{ padLeft?: boolean }>`
  display: grid;
  grid-row-gap: 10px;
  padding-left: ${(props) => (props.padLeft ? '10px' : '0px')};
`;
