import React from 'react';
import PropTypes from 'prop-types';
import { css, ThemeProvider } from 'styled-components';
import { SlideContext } from 'spectacle/es/components/slide/slide';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { deckSlice, themeSelector } from '../../slices/deck-slice';

const activeSlideContainerStyle = css`
  outline: #ee5396 solid 2px;

  div {
    overflow: hidden;
  }
`;

/**
 * S TODO: Update this doc
 * SlideViewer is an un-styled wrapper that provides the context data
 * required for rendering slide components.
 * @param children An array of slides or single slide
 * @param scale The value at which slides should render in relation to their fixed size
 * @param slideProps Any props passed to each Slide component
 * @returns {JSX.Element}
 */
export const SlideViewer = ({
  children,
  scale,
  slideProps,
  isInTimeline = false
}) => {
  const theme = useSelector(themeSelector);
  const activeSlideId = useSelector(
    (state) => state.deck.activeSlide?.id || ''
  );
  const dispatch = useDispatch();
  const [localSlides, setLocalSlides] = React.useState([]);

  // Build out slide
  const slides = React.useMemo(() => {
    const slideEls = (children instanceof Array ? children : [children]).flat();

    return slideEls.map((slide) => {
      return React.cloneElement(slide, {
        scale,
        slideProps: {
          ...slideProps,
          containerStyle: (() => {
            if (activeSlideId === slide?.props?.id && isInTimeline) {
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
  }, [activeSlideId, children, isInTimeline, scale, slideProps]);

  // Keep local slides in sync with actual slides
  React.useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  // Temporarily move item
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
    <SlideContext.Provider
      value={{ activeStepIndex: 0, activationThresholds: [] }}
    >
      <ThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          {localSlides.map((slide, idx) => (
            <DraggableItem
              key={slide.key}
              index={idx}
              moveItem={moveItem}
              onDrop={commitChangedOrder}
            >
              {slide}
            </DraggableItem>
          ))}
        </DndProvider>
      </ThemeProvider>
    </SlideContext.Provider>
  );
};

SlideViewer.propTypes = {
  slideProps: PropTypes.object,
  scale: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  isInTimeline: PropTypes.bool
};

const DraggableItem = ({ children, index, moveItem, onDrop }) => {
  const ref = React.useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'Card',

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },

    drop() {
      onDrop();
    },

    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Card',
    item: () => {
      return { id: children.key, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ display: 'inherit', opacity }}
      data-handler-id={handlerId}
    >
      {children}
    </div>
  );
};
DraggableItem.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  moveItem: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};
