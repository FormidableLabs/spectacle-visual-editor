import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import Moveable from 'react-moveable';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { deckSlice, editableElementIdSelector } from '../../slices/deck-slice';

const Wrapper = styled.div`
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

export const SelectionFrame = ({ children }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const editableElementId = useSelector(editableElementIdSelector);
  const [target, setTarget] = useState();

  const handleOnResize = useCallback((event) => {
    event.target.style.width = `${event.width}px`;
    event.target.style.height = `${event.height}px`;
  }, []);

  const handleOnResizeEnd = useCallback(
    (event) => {
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
      setTarget(ref.current);
    } else {
      setTarget(null);
    }
  }, [children, editableElementId]);

  const isSelected = editableElementId === children.props.id;

  return (
    <>
      <Wrapper
        onClick={(e) => {
          e.stopPropagation();
          dispatch(
            deckSlice.actions.editableElementSelected(children.props.id)
          );
        }}
        isSelected={isSelected}
      >
        {cloneElement(children, { ref })}
      </Wrapper>
      <Moveable
        target={target}
        origin={false}
        resizable={children.props.type === 'Box'}
        onResize={handleOnResize}
        onResizeEnd={handleOnResizeEnd}
      />
    </>
  );
};

SelectionFrame.propTypes = {
  children: PropTypes.node.isRequired
};
