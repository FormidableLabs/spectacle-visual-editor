import { useCallback, MouseEvent } from 'react';
import { deckSlice } from '../slices/deck-slice';
import { useDispatch } from 'react-redux';

export const useEditorActions = () => {
  const dispatch = useDispatch();

  const handleCanvasMouseDown = useCallback(
    (event: MouseEvent) => {
      if ((<HTMLElement>event.target).classList.contains('moveable-control')) {
        return;
      } else if (!(<HTMLElement>event.target).id) {
        dispatch(deckSlice.actions.editableElementSelected(null));
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      dispatch(
        deckSlice.actions.editableElementSelected(
          (<HTMLElement>event?.target).id
        )
      );
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
