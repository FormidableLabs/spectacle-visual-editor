import { useCallback } from 'react';
import { deckSlice } from '../slices/deck-slice';
import { useDispatch } from 'react-redux';

export const useEditorActions = () => {
  const dispatch = useDispatch();

  const handleCanvasMouseDown = useCallback(
    (event) => {
      if (event.target.classList.contains('moveable-control')) {
        return;
      } else if (!event.target.id) {
        dispatch(deckSlice.actions.editableElementSelected(null));
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      dispatch(deckSlice.actions.editableElementSelected(event?.target.id));
    },
    [dispatch]
  );

  const handleSlideSelected = useCallback(
    (id) => dispatch(deckSlice.actions.activeSlideWasChanged(id)),
    [dispatch]
  );

  return { handleCanvasMouseDown, handleSlideSelected };
};
