import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { deckSlice } from '../../../slices/deck-slice';
import { SlideViewerWrapper } from './slide-viewer-wrapper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SlideDragWrapper } from './slide-drag-wrapper';
import { css } from 'styled-components';
import { SlideViewerPropTypes } from './slide-viewer-prop-types';

/**
 * Slide Viewer for timeline
 * @param children
 * @param scale
 * @param slideProps
 * @returns {JSX.Element}
 */
export const TimelineSlideViewer = ({ children, scale, slideProps }) => {
  const activeSlideId = useSelector(
    (state) => state.deck.activeSlide?.id || ''
  );
  const dispatch = useDispatch();
  const [localSlides, setLocalSlides] = React.useState([]);

  // Flatten out slides, tweak for active slide
  const slides = React.useMemo(() => {
    const slideEls = (children instanceof Array ? children : [children]).flat();

    return slideEls.map((slide) => {
      return React.cloneElement(slide, {
        scale,
        slideProps: {
          ...slideProps,
          containerStyle: (() => {
            if (activeSlideId === slide?.props?.id) {
              return [
                ...(slideProps?.containerStyle || []),
                activeSlideContainerStyle
              ];
            }

            return slideProps?.containerStyle || [];
          })()
        },
        key: slide.props.id
      });
    });
  }, [activeSlideId, children, scale, slideProps]);

  // Keep local slides in sync with actual slides
  React.useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  // Move a local item as its dragged.
  const moveItem = React.useCallback((dragIndex, hoverIndex) => {
    setLocalSlides((items) => {
      const clonedItems = [...items];
      const dragItem = items[dragIndex];

      clonedItems.splice(dragIndex, 1);
      clonedItems.splice(hoverIndex, 0, dragItem);

      return clonedItems;
    });
  }, []);

  // Commit changes
  const commitChangedOrder = React.useCallback(() => {
    const currentIds = slides?.map((slide) => slide?.props?.id) || [];
    const newIds = localSlides?.map((slide) => slide?.props?.id) || [];

    if (currentIds.join(',') !== newIds.join(',')) {
      dispatch(deckSlice.actions.reorderSlides(newIds));
    }
  }, [dispatch, localSlides, slides]);

  return (
    <SlideViewerWrapper>
      <DndProvider backend={HTML5Backend}>
        {localSlides.map((slide, idx) => (
          <SlideDragWrapper
            key={slide.key}
            index={idx}
            moveItem={moveItem}
            onDrop={commitChangedOrder}
          >
            {slide}
          </SlideDragWrapper>
        ))}
      </DndProvider>
    </SlideViewerWrapper>
  );
};

TimelineSlideViewer.propTypes = SlideViewerPropTypes;

const activeSlideContainerStyle = css`
  outline: #ee5396 solid 2px;

  div {
    overflow: hidden;
  }
`;
