import React from 'react';
import { useRootSelector } from '../../../store';
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
import { DeckElement } from '../../../types/deck-elements';
import { cloneDeep } from 'lodash-es';

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
    const currentIds = activeSlideChildren?.map((el) => el?.id) || [];
    const newIds = localChildren?.map((el) => el?.id) || [];

    // S TODO: This only handles first-level changes, needs to be recursive...
    if (currentIds.join(',') !== newIds.join(',')) {
      dispatch(deckSlice.actions.reorderActiveSlideElements(newIds));
    }
  }, [activeSlideChildren, dispatch, localChildren]);

  /**
   * Search for an item by ID inside a list of nodes
   */
  const __findItem = React.useCallback((id: string, nodes: DeckElement[]):
    | DeckElement
    | false => {
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
  const __moveItem = React.useCallback(
    (id: string, afterId: string, nodeId: string) => {
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
          {localChildren.map((el, idx) => {
            return (
              <SlideElementDragWrapper
                key={el.id}
                id={el.id}
                index={idx}
                onDrop={commitChangedOrder}
                moveItem={moveItem}
              >
                <ElItem key={el.id} el={el} />
              </SlideElementDragWrapper>
            );
          })}
        </DndProvider>
      </GridContainer>
    </Pane>
  );
};

const ElItem: React.FC<{ el: DeckElement }> = ({ el }) => {
  if (Array.isArray(el.children)) {
    return (
      <div>
        <div>{el.component}</div>
        <GridContainer padLeft>
          {el.children.map((subEl, idx) => (
            <SlideElementDragWrapper
              key={subEl.id}
              id={subEl.id}
              index={idx}
              onDrop={() => null}
              moveItem={() => null}
            >
              <ElementCard element={subEl} key={el.id} />
            </SlideElementDragWrapper>
          ))}
        </GridContainer>
      </div>
    );
  }

  return <ElementCard element={el} />;
};

const GridContainer = styled.div<{ padLeft?: boolean }>`
  display: grid;
  grid-row-gap: 10px;
  padding-left: ${(props) => (props.padLeft ? '10px' : '0px')};
`;
