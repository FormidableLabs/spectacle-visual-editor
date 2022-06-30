import { useCallback, MouseEvent } from 'react';
import { deckSlice } from '../slices/deck-slice';
import { useDispatch } from 'react-redux';

export const useEditorActions = () => {
  const dispatch = useDispatch();

  const handleCanvasMouseDown = useCallback(
    (event: MouseEvent) => {
      const target = event?.target as Element;
      if (target?.classList.contains('moveable-control')) {
        return;
      } else if (!target.id) {
        dispatch(deckSlice.actions.editableElementSelected(null));
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      dispatch(deckSlice.actions.editableElementSelected(target.id));
    },
    [dispatch]
  );

  const handleSlideSelected = useCallback(
    (id: string) => dispatch(deckSlice.actions.activeSlideWasChanged(id)),
    [dispatch]
  );

  const handleTemplateSelected = useCallback(
    () => dispatch(deckSlice.actions.setSlideTemplateOpen(true)),
    [dispatch]
  );

  return { handleCanvasMouseDown, handleSlideSelected, handleTemplateSelected };
};
