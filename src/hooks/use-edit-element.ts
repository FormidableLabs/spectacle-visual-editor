import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deckSlice } from '../slices/deck-slice';

export const useEditElement = () => {
  const dispatch = useDispatch();

  const handleElementChanged = useCallback(
    (sender) => dispatch(deckSlice.actions.editableElementChanged(sender)),
    [dispatch]
  );

  return handleElementChanged;
};
