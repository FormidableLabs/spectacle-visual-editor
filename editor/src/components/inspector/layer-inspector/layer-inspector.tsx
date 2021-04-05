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
  // S TODO: Remove this duplicated logic
  const moveItem = React.useCallback((dragIndex, hoverIndex) => {
    setLocalChildren((items) => {
      const clonedItems = [...items];
      const dragItem = items[dragIndex];

      clonedItems.splice(dragIndex, 1);
      clonedItems.splice(hoverIndex, 0, dragItem);

      return clonedItems;
    });
  }, []);

  // Commit changes
  const commitChangedOrder = React.useCallback(() => {
    const currentIds = activeSlideChildren?.map((el) => el?.id) || [];
    const newIds = localChildren?.map((el) => el?.id) || [];

    if (currentIds.join(',') !== newIds.join(',')) {
      dispatch(deckSlice.actions.reorderActiveSlideElements(newIds));
    }
  }, [activeSlideChildren, dispatch, localChildren]);

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
                <ElementCard element={el} />
              </SlideElementDragWrapper>
            );
          })}
        </DndProvider>
      </GridContainer>
    </Pane>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-row-gap: 10px;
`;
