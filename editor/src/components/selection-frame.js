import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import Moveable from 'react-moveable';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { deckSlice, editableElementIdSelector } from '../slices/deck-slice';

export const SelectionFrame = ({ children }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const editableElementId = useSelector(editableElementIdSelector);
  const [target, setTarget] = useState();

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      dispatch(deckSlice.actions.editableElementSelected(children.props.id));
    },
    [children, dispatch]
  );

  useEffect(() => {
    if (editableElementId === children.props.id) {
      setTarget(ref.current);
    } else {
      setTarget(null);
    }
  }, [children, editableElementId]);

  return (
    <>
      {cloneElement(children, {
        ref,
        onClick: handleClick
      })}
      <Moveable
        target={target}
        origin={false}
        resizable={children.props.type === 'Box'}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
        }}
        onResizeEnd={(e) => {
          dispatch(
            deckSlice.actions.editableElementChanged({
              width: e.target.style.width,
              height: e.target.style.height
            })
          );
        }}
      />
    </>
  );
};

SelectionFrame.propTypes = {
  children: PropTypes.node.isRequired
};
