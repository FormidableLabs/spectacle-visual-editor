import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  MouseEvent
} from 'react';
import styled from 'styled-components';
import Moveable, { OnResizeEnd } from 'react-moveable';
import { useDispatch, useSelector } from 'react-redux';
import { deckSlice, editableElementIdSelector } from '../../slices/deck-slice';
import { RESIZABLE_ELEMENTS } from '../../types/deck-elements';

const Wrapper = styled.div<{ isSelected: boolean }>`
  display: contents;

  > div {
    outline: ${(props) =>
      props.isSelected ? `2px solid ${props.theme.colors.secondary}` : ''};
    &:hover {
      outline: ${(props) =>
        props.isSelected
          ? `2px solid ${props.theme.colors.secondary}`
          : `1px solid ${props.theme.colors.primary}`};
    }
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
  const editableElementId = useSelector(editableElementIdSelector);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  /**
   * Moveable can't detect size of image until it is loaded,
   *  so we'll keep track of the loaded state for images.
   * Non-Image components are assumed to be loaded from the start.
   */
  const isImgElement = children?.props?.type === 'Image';
  const imgSrc = children?.props?.src;
  const [elLoaded, setElLoaded] = React.useState(!isImgElement);

  const handleOnResize = useCallback((event) => {
    event.target.style.width = `${event.width}px`;
    event.target.style.height = `${event.height}px`;
  }, []);

  const handleOnResizeEnd = useCallback(
    (event: OnResizeEnd) => {
      dispatch(
        deckSlice.actions.editableElementChanged({
          width: event.target.style.width,
          height: event.target.style.height
        })
      );
      event.target.style.width = '';
      event.target.style.height = '';
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
   * If img src changes, we need to reset to unloaded state
   */
  useEffect(() => {
    if (imgSrc) {
      setElLoaded(false);
    }
  }, [imgSrc]);

  const isSelected = editableElementId === children.props.id;

  return (
    <>
      <Wrapper
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
        isSelected={isSelected}
      >
        {cloneElement(children, {
          ref,
          onLoad: () => setElLoaded(true)
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
          key={treeId}
        />
      )}
    </>
  );
};
