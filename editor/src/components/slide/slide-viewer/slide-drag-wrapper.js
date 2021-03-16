import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

/**
 * Slides in the Timeline can be dragged to reorder the slides in the deck.
 * This component contains the logic needed for DnD functionality.
 * @param children Slide element to be rendered
 * @param index The index of the slide within the list of slides.
 * @param moveItem Method that's called when item is dragged to new position
 * @param onDrop Method called when element is dropped
 * @returns {JSX.Element}
 */
export const SlideDragWrapper = ({ children, index, moveItem, onDrop }) => {
  const ref = React.useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'Slide',

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
    type: 'Slide',
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

SlideDragWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  moveItem: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};
