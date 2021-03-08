import React, { useCallback } from 'react';
import { Pane } from './inspector-styles';
import { useDispatch, useSelector } from 'react-redux';
import { deckSlice, selectedElementSelector } from '../slices/deck-slice';
import { BoxFormatControls } from './box-format-controls';
import { isBoxElement } from './validators';

export const FormatInspector = () => {
  const dispatch = useDispatch();
  const selectedElement = useSelector(selectedElementSelector);
  const handleElementChanged = useCallback(
    (sender) => dispatch(deckSlice.actions.editableElementChanged(sender)),
    [dispatch]
  );

  return (
    <Pane>
      {isBoxElement(selectedElement) && (
        <BoxFormatControls
          editableElementChanged={handleElementChanged}
          selectedElement={selectedElement}
        />
      )}
    </Pane>
  );
};
