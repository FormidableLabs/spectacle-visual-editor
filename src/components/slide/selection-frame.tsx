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
  SELF_RESIZING_ELEMENTS,
  SPECTACLE_ELEMENTS
} from '../../types/deck-elements';
import { isMdElement } from '../inspector/validators';
import { VisualEditor } from '../user-interface/visual-editor/visual-editor';
import './selection-frame.css';

interface Props {
  children: React.ReactElement;
  treeId: string;
}

export const SelectionFrame: React.FC<Props> = ({ children, treeId }) => {
  const ref = useRef<HTMLElement>(null);
  const moveableRef = useRef<Moveable>(null);
  const dispatch = useDispatch();
  const editableElementId = useSelector(selectedEditableElementIdSelector);
  const selectedElement = useSelector(selectedElementSelector);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const hoveredElementId = useSelector(hoveredEditableElementIdSelector);

  // Retrieve all the child props here to contain all their ambiguity in one
  // spot and avoid `any` types as much as possible.
  const {
    type: childType,
    src: imgSrc,
    id: childId = 'should-not-see-this-id',
    width: childWidth,
    height: childHeight,
    position: childPosition,
    children: childChildren
  } = (children?.props || {}) as {
    type?: SPECTACLE_ELEMENTS;
    src?: string;
    id?: string;
    width?: number;
    height?: number;
    position?: number;
    children?: any;
  };
  const {
    isFreeMovement: childIsFreeMovement,
    positionX: childPositionX,
    positionY: childPositionY
  } = (children?.props?.componentProps || {}) as {
    isFreeMovement?: boolean;
    positionX?: number;
    positionY?: number;
  };

  /**
   * Moveable can't detect size of image until it is loaded,
   *  so we'll keep track of the loaded state for images.
   * Non-Image components are assumed to be loaded from the start.
   */
  const isImgElement = childType === 'Image';
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
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (editableElementId === childId) {
      setTarget(ref.current);
    } else {
      setTarget(null);
    }
  }, [childId, editableElementId]);

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
    if (moveableRef.current?.props.target) {
      moveableRef.current.updateRect();
    }
  }, [childWidth, childHeight, childPosition]);

  /**
   *  If the child's content changes and can cause resizing, let the moveable instance know
   */
  useEffect(() => {
    if (
      SELF_RESIZING_ELEMENTS.includes(childType!) &&
      moveableRef.current?.props.target
    ) {
      moveableRef.current.updateRect();
    }
  }, [childChildren, childType]);

  /**
   *  If the child's positions change from manually entering coordinate, update the target frame
   */
  useEffect(() => {
    if (moveableRef.current?.props.target) {
      moveableRef.current.moveable.updateTarget();
    }
  }, [childIsFreeMovement, childPositionX, childPositionY]);

  /**
   * If img src changes, we need to reset to unloaded state
   */
  useEffect(() => {
    if (imgSrc) {
      setElLoaded(false);
    }
  }, [imgSrc]);

  const [doubleClickedElement, setDoubleClickedElement] = useState(false);

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

  const isHovered = hoveredElementId === childId;
  const isSelected = editableElementId === childId;

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (
        (event.target as HTMLElement).classList.contains('moveable-control')
      ) {
        return;
      }
      event.stopPropagation();
      dispatch(deckSlice.actions.editableElementSelected(childId));

      if (event.detail === 2) {
        setDoubleClickedElement(true);
      }
    },
    [childId, dispatch]
  );

  useEffect(() => {
    if (doubleClickedElement && selectedElement?.id !== childId) {
      setDoubleClickedElement(false);
    }
  }, [childId, doubleClickedElement, selectedElement?.id]);

  const isEditingMarkdown =
    doubleClickedElement && isMdElement(selectedElement);

  const editingFrameMetrics = childIsFreeMovement
    ? {
        left: childPositionX || 0,
        top: childPositionY || 0,
        width: childWidth,
        height: childHeight
      }
    : {};

  return (
    <>
      <div
        className={clsx('wrapper', {
          selected: isSelected,
          hovered: isHovered
        })}
        onMouseOver={hoverElement(childId)}
        onMouseLeave={unhoverElement}
        onMouseDown={handleMouseDown}
      >
        {isEditingMarkdown ? (
          <div
            className="markdown-editor-container"
            style={editingFrameMetrics}
          >
            <VisualEditor />
          </div>
        ) : (
          cloneElement(children, {
            ref,
            onLoad: () => setElLoaded(true),
            isSelected
          })
        )}
      </div>
      {elLoaded && (
        <Moveable
          ref={moveableRef}
          target={target}
          origin={false}
          resizable={
            RESIZABLE_ELEMENTS.includes(childType!) && !isEditingMarkdown
          }
          onResize={handleOnResize}
          onResizeEnd={handleOnResizeEnd}
          keepRatio={isShiftDown}
          draggable={childIsFreeMovement && !isEditingMarkdown}
          onDrag={handleOnDragMovement}
          onDragEnd={handleOnDragMovementEnd}
          key={treeId}
        />
      )}
    </>
  );
};
