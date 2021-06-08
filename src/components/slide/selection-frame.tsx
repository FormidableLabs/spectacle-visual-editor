import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  MouseEvent
} from 'react';
import styled from 'styled-components';
import Moveable, { OnDrag, OnDragEnd, OnResizeEnd } from 'react-moveable';
import { useDispatch, useSelector } from 'react-redux';
import {
  deckSlice,
  hoveredEditableElementIdSelector,
  selectedEditableElementIdSelector
} from '../../slices/deck-slice';
import { RESIZABLE_ELEMENTS } from '../../types/deck-elements';

const Wrapper = styled.div<{ isHovered: boolean; isSelected: boolean }>`
  display: contents;

  > div,
  > img,
  > pre {
    outline: ${(props) =>
      props.isSelected
        ? `2px solid ${props.theme.colors.secondary}`
        : props.isHovered
        ? `1px solid ${props.theme.colors.primary}`
        : ''};
  }
`;

interface Props {
  children: React.ReactElement;
  treeId: string;
}

export const SelectionFrame: React.FC<Props> = ({ children, treeId }) => {
  const ref = useRef<HTMLElement>();
  const moveableRef = useRef<Moveable>(null);
  const dispatch = useDispatch();
  const editableElementId = useSelector(selectedEditableElementIdSelector);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const hoveredElementId = useSelector(hoveredEditableElementIdSelector);

  /**
   * Moveable can't detect size of image until it is loaded,
   *  so we'll keep track of the loaded state for images.
   * Non-Image components are assumed to be loaded from the start.
   */
  const isImgElement = children?.props?.type === 'Image';
  const imgSrc = children?.props?.src;
  const [elLoaded, setElLoaded] = React.useState(!isImgElement);

  const handleOnResize = useCallback((event) => {
    //if resizing N, NW, NE, W, or SW
    if (
      event.direction.some((e: number) => {
        return e < 0;
      })
    ) {
      event.target.style.left = `${event.drag.left}px`;
      event.target.style.top = `${event.drag.top}px`;
    }
    event.target.style.width = `${event.width}px`;
    event.target.style.height = `${event.height}px`;
  }, []);

  const handleOnResizeEnd = useCallback(
    (event: OnResizeEnd) => {
      dispatch(
        deckSlice.actions.editableElementChanged({
          left: `${Math.round(event.lastEvent.drag.left)}px`,
          top: `${Math.round(event.lastEvent.drag.top)}px`,
          width: event.target.style.width,
          height: event.target.style.height,
          componentProps: {
            isFreeMovement: true,
            positionX: `${Math.round(event.lastEvent.drag.left)}px`,
            positionY: `${Math.round(event.lastEvent.drag.top)}px`
          }
        })
      );
      event.target.style.left = '';
      event.target.style.top = '';
      event.target.style.width = '';
      event.target.style.height = '';
    },
    [dispatch]
  );

  const handleOnDragMovement = (event: OnDrag) => {
    event.target.style.top = `${event.top}px`;
    event.target.style.left = `${event.left}px`;
  };

  const handleOnDragMovementEnd = useCallback(
    (event: OnDragEnd) => {
      if (event.lastEvent) {
        dispatch(
          deckSlice.actions.editableElementChanged({
            left: `${Math.round(event.lastEvent.left)}px`,
            top: `${Math.round(event.lastEvent.top)}px`,
            componentProps: {
              isFreeMovement: true,
              positionX: `${Math.round(event.lastEvent.left)}px`,
              positionY: `${Math.round(event.lastEvent.top)}px`
            }
          })
        );
        event.target.style.top = '';
        event.target.style.left = '';
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (editableElementId === children.props.id) {
      setTarget(ref.current || null);
    } else {
      setTarget(null);
    }
  }, [children, editableElementId]);

  /**
   *  If the child's dimensions change, let the moveable instance know
   */
  useEffect(() => {
    if (moveableRef?.current?.props?.target) {
      moveableRef.current.updateRect();
    }
  }, [children?.props?.width, children?.props?.height]);

  /**
   *  If the child's positions change from manually entering coordinate, update the target frame
   */
  useEffect(() => {
    if (moveableRef?.current?.props?.target) {
      moveableRef.current.moveable.updateTarget();
    }
  }, [
    children?.props?.componentProps?.isFreeMovement,
    children?.props?.componentProps?.positionX,
    children?.props?.componentProps?.positionY
  ]);

  /**
   * If img src changes, we need to reset to unloaded state
   */
  useEffect(() => {
    if (imgSrc) {
      setElLoaded(false);
    }
  }, [imgSrc]);

  const hoverElement = useCallback(
    (id) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      dispatch(deckSlice.actions.editableElementHovered(id));
    },
    [dispatch]
  );

  const unhoverElement = useCallback(() => {
    dispatch(deckSlice.actions.editableElementHovered(null));
  }, [dispatch]);

  const isHovered = hoveredElementId === children.props.id;
  const isSelected = editableElementId === children.props.id;

  return (
    <>
      <Wrapper
        isHovered={isHovered}
        isSelected={isSelected}
        onMouseOver={hoverElement(children.props.id)}
        onMouseLeave={unhoverElement}
        onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
          if (
            (e.target as HTMLElement).classList.contains('moveable-control')
          ) {
            return;
          }

          e.stopPropagation();
          dispatch(
            deckSlice.actions.editableElementSelected(children.props.id)
          );
        }}
      >
        {cloneElement(children, {
          ref,
          onLoad: () => setElLoaded(true),
          isSelected
        })}
      </Wrapper>
      {elLoaded && (
        <Moveable
          ref={moveableRef}
          target={target}
          origin={false}
          resizable={RESIZABLE_ELEMENTS.includes(children.props.type)}
          onResize={handleOnResize}
          onResizeEnd={handleOnResizeEnd}
          keepRatio={children.props.type === 'Image'}
          draggable={children.props.componentProps?.isFreeMovement}
          onDrag={handleOnDragMovement}
          onDragEnd={handleOnDragMovementEnd}
          key={treeId}
        />
      )}
    </>
  );
};
