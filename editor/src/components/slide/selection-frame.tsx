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
}

export const SelectionFrame: React.FC<Props> = ({ children }) => {
  const ref = useRef<HTMLElement>();
  const dispatch = useDispatch();
  const editableElementId = useSelector(editableElementIdSelector);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  /**
   * Moveable can't detect size of image until it is loaded,
   *  so we'll keep track of the loaded state for images.
   * Non-Image components are assumed to be loaded from the start.
   */
  const [elLoaded, setElLoaded] = React.useState(
    children?.props?.type !== 'Image'
  );

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
          // Image elements will need to alert the component once loaded
          onLoad: elLoaded ? () => null : () => setElLoaded(true)
        })}
      </Wrapper>
      {elLoaded && (
        <Moveable
          target={target}
          origin={false}
          resizable={['Box', 'Image'].includes(children.props.type)}
          onResize={handleOnResize}
          onResizeEnd={handleOnResizeEnd}
          keepRatio={children.props.type === 'Image'}
        />
      )}
    </>
  );
};
