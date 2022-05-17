import { useDispatch } from 'react-redux';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  activeSlideIdSelector,
  deckSlice,
  slideTemplateOpenSelector
} from '../../../slices/deck-slice';
import { SlideViewerWrapper } from './slide-viewer-wrapper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragWrapper } from '../../helpers/drag-wrapper';
import styled, { css } from 'styled-components';
import {
  TrashIcon,
  IconButton,
  PlusIcon,
  Tooltip,
  defaultTheme
} from 'evergreen-ui';
import { useRootSelector } from '../../../store';
import { moveArrayItem } from '../../../util/move-array-item';

interface Props {
  scale: number;
  slideProps: Record<string, any>;
  template: React.ReactNode;
  onTemplateClick(): void;
}

/**
 * Slide Viewer for timeline
 */
export const TimelineSlideViewer: React.FC<Props> = ({
  children,
  scale,
  slideProps,
  template,
  onTemplateClick
}) => {
  const activeSlideId = useRootSelector(activeSlideIdSelector);
  const slideTemplateOpen = useRootSelector(slideTemplateOpenSelector);
  const dispatch = useDispatch();
  const [localSlides, setLocalSlides] = useState<React.ReactElement[]>([]);
  const slidesRef = useRef<HTMLDivElement>(null);

  // Flatten out slides, tweak for active slide
  const slides = useMemo(() => {
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
          // unless slide template is open
          containerStyle: (() => {
            if (activeSlideId === slide?.props?.id && !slideTemplateOpen) {
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
  }, [activeSlideId, slideTemplateOpen, children, scale, slideProps]);

  const templateNode = useMemo(() => {
    if (!template) {
      return null;
    }

    const templateEl = template as React.ReactElement;

    return React.cloneElement(templateEl, {
      scale,
      slideProps: {
        ...slideProps,
        // Override click action
        onSlideClick: onTemplateClick,
        // Add active style when template is open
        containerStyle: (() => {
          if (slideTemplateOpen) {
            return [
              ...(slideProps?.containerStyle || []),
              activeSlideContainerStyle
            ];
          }

          return slideProps?.containerStyle || [];
        })()
      },
      key: templateEl.props.id
    });
  }, [scale, slideProps, template, slideTemplateOpen, onTemplateClick]);

  // Keep local slides in sync with actual slides
  useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  // Move a local item as its dragged.
  const moveItem = React.useCallback(
    ({ index: dragIndex }, { index: hoverIndex }) => {
      setLocalSlides((items) => moveArrayItem(items, dragIndex, hoverIndex));
    },
    []
  );

  // Commit changes
  const commitChangedOrder = React.useCallback(() => {
    const currentIds = slides?.map((slide) => slide?.props?.id) || [];
    const newIds = localSlides?.map((slide) => slide?.props?.id) || [];

    if (currentIds.join(',') !== newIds.join(',')) {
      dispatch(deckSlice.actions.reorderSlides(newIds));
    }
  }, [dispatch, localSlides, slides]);

  // Scroll to new slide when added
  useEffect(() => {
    const activeSlide = document.querySelector(
      `[data-slideid="${activeSlideId}"]`
    );

    if (activeSlide) {
      activeSlide.scrollIntoView();
    }
  }, [activeSlideId, localSlides]);

  return (
    <Container>
      {/* Template */}
      <TemplateContainer>
        <SlideViewerWrapper slideIndex={-1}>
          <Slide>{templateNode}</Slide>
        </SlideViewerWrapper>
      </TemplateContainer>
      {/* Slides */}
      <Slides ref={slidesRef}>
        <DndProvider backend={HTML5Backend}>
          {localSlides.map((slide, idx) => (
            <SlideViewerWrapper key={slide.key} slideIndex={idx}>
              <Slide data-slideid={slide.key}>
                <DragWrapper
                  index={idx}
                  type="Slide"
                  onDrag={moveItem}
                  onDrop={commitChangedOrder}
                  orientation="horizontal"
                >
                  {slide}
                </DragWrapper>

                {slides.length > 1 && (
                  <Tooltip content="Delete Slide">
                    <DeleteButton>
                      <IconButton
                        icon={TrashIcon}
                        appearance="minimal"
                        onClick={() =>
                          dispatch(deckSlice.actions.deleteSlide(slide.key))
                        }
                      />
                    </DeleteButton>
                  </Tooltip>
                )}
              </Slide>
            </SlideViewerWrapper>
          ))}
        </DndProvider>
      </Slides>

      <Tooltip content="Add Slide">
        <AddButton>
          <IconButton
            width={80}
            height="100%"
            icon={PlusIcon}
            appearance="minimal"
            onClick={() => dispatch(deckSlice.actions.newSlideAdded())}
          />
        </AddButton>
      </Tooltip>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  background: ${defaultTheme.colors.gray400};
  border-top: 1px ${defaultTheme.colors.gray500} solid;
`;

const TemplateContainer = styled.div`
  margin-right: 10px;
  position: relative;

  &::before {
    background-color: ${defaultTheme.colors.gray600};
    content: '';
    height: calc(100% - 10px);
    position: absolute;
    right: -5px;
    top: 5px;
    transform: translateX(50%);
    width: 1px;
  }
`;

const Slides = styled.div`
  display: flex;
  overflow: auto;
`;

const Slide = styled.div`
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  padding: 5px;
`;

const AddButton = styled.div`
  height: auto;
  padding: 5px;
`;

const DeleteButton = styled.div`
  position: absolute;
  right: 5px;
  bottom: 5px;
  opacity: 0;

  ${Slide}:hover & {
    opacity: 1;
  }
`;

const activeSlideContainerStyle = css`
  outline: #ee5396 solid 2px;
  overflow: hidden;

  div {
    overflow: hidden;
  }
`;
