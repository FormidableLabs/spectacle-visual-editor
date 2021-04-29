import { useDispatch } from 'react-redux';
import React from 'react';
import { activeSlideIdSelector, deckSlice } from '../../../slices/deck-slice';
import { SlideViewerWrapper } from './slide-viewer-wrapper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SlideDragWrapper } from './slide-drag-wrapper';
import { css } from 'styled-components';
import { useRootSelector } from '../../../store';
import { swapArrayItems } from '../../../util/swap-array-items';

interface Props {
  scale: number;
  slideProps: Record<string, any>;
}

/**
 * Slide Viewer for timeline
 */
export const TimelineSlideViewer: React.FC<Props> = ({
  children,
  scale,
  slideProps
}) => {
  const activeSlideId = useRootSelector(activeSlideIdSelector);
  const dispatch = useDispatch();
  const [localSlides, setLocalSlides] = React.useState<React.ReactElement[]>(
    []
  );

  // Flatten out slides, tweak for active slide
  const slides = React.useMemo(() => {
    const slideEls = (children instanceof Array
      ? Array.from(children)
      : [children]
    ).flat() as React.ReactElement[];

    return slideEls.map((slide) => {
      return React.cloneElement(slide, {
        scale,
        slideProps: {
          ...slideProps,
          // Hi-jack containerStyle to add active style for active slide
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
    setLocalSlides((items) => swapArrayItems(items, dragIndex, hoverIndex));
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

const activeSlideContainerStyle = css`
  outline: #ee5396 solid 2px;

  div {
    overflow: hidden;
  }
`;
