import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  MouseEvent
} from 'react';
import clsx from 'clsx';
import Moveable, {
  OnDrag,
  OnDragEnd,
  OnResize,
  OnResizeEnd
} from 'react-moveable';
import { useDispatch, useSelector } from 'react-redux';
import {
  deckSlice,
  hoveredEditableElementIdSelector,
  selectedEditableElementIdSelector,
  selectedElementSelector
} from '../../slices/deck-slice';
import {
  RESIZABLE_ELEMENTS,
  SELF_RESIZING_ELEMENTS
} from '../../types/deck-elements';
import { isMdElement } from '../inspector/validators';
import { VisualEditor } from '../user-interface/visual-editor/visual-editor';
import './selection-frame.css';

interface Props {
  children: React.ReactElement;
  treeId: string;
}

export const SelectionFrame: React.FC<Props> = ({ children, treeId }) => {
  const ref = useRef<HTMLElement>();
  const moveableRef = useRef<Moveable>(null);
  const dispatch = useDispatch();
  const editableElementId = useSelector(selectedEditableElementIdSelector);
  const selectedElement = useSelector(selectedElementSelector);
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

  const handleOnResize = useCallback((event: OnResize) => {
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
   * If shift is held down, the image should keep its ratio when resizing
   */
  const [isShiftDown, setIsShiftDown] = useState(false);

  const handleUserKeyPress = useCallback(
    (event: KeyboardEvent, isKeyDown: boolean) => {
      const { key } = event;
      if (key === 'Shift') {
        setIsShiftDown(isKeyDown);
      }
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleUserKeyPress(e, true);
    const handleKeyUp = (e: KeyboardEvent) => handleUserKeyPress(e, false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleUserKeyPress]);

  /**
   *  If the child's dimensions or css position change, let the moveable instance know
   */
  useEffect(() => {
    if (moveableRef?.current?.props?.target) {
      moveableRef.current.updateRect();
    }
  }, [
    children?.props?.width,
    children?.props?.height,
    children?.props?.position
  ]);

  /**
   *  If the child's content changes and can cause resizing, let the moveable instance know
   */
  useEffect(() => {
    if (
      SELF_RESIZING_ELEMENTS.includes(children?.props?.type) &&
      moveableRef?.current?.props?.target
    ) {
      moveableRef.current.updateRect();
    }
  }, [children?.props?.children, children?.props?.type]);

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
    (id: string) => (e: MouseEvent<HTMLDivElement>) => {
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
  const isSelectedAndMarkdown = isSelected && isMdElement(selectedElement);

  return (
    <>
      <div
        className={clsx({
          'wrapper selected': isSelected,
          'wrapper hovered': isHovered
        })}
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
        {/*isSelectedAndMarkdown ? (
          <VisualEditor />
        ) : (
          cloneElement(children, {
            ref,
            onLoad: () => setElLoaded(true),
            isSelected
          })
        )*/}
        {cloneElement(children, {
          ref,
          onLoad: () => setElLoaded(true),
          isSelected
        })}
      </div>
      {elLoaded && (
        <Moveable
          ref={moveableRef}
          target={target}
          origin={false}
          resizable={RESIZABLE_ELEMENTS.includes(children.props.type)}
          onResize={handleOnResize}
          onResizeEnd={handleOnResizeEnd}
          keepRatio={isShiftDown}
          draggable={children.props.componentProps?.isFreeMovement}
          onDrag={handleOnDragMovement}
          onDragEnd={handleOnDragMovementEnd}
          key={treeId}
        />
      )}
    </>
  );
};
