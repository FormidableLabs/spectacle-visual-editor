import { useCallback } from 'react';
import { deckSlice } from '../slices/deck-slice';
import { useDispatch } from 'react-redux';

export const useEditorActions = () => {
  const dispatch = useDispatch();

  const handleSlideSelected = useCallback(
    (id: string) => dispatch(deckSlice.actions.activeSlideWasChanged(id)),
    [dispatch]
  );

  const handleTemplateSelected = useCallback(
    () => dispatch(deckSlice.actions.setSlideTemplateOpen(true)),
    [dispatch]
  );

  return { handleSlideSelected, handleTemplateSelected };
};
