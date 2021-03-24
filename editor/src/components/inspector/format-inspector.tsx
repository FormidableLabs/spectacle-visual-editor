import React, { useCallback } from 'react';
import { Pane } from './inspector-styles';
import { useDispatch, useSelector } from 'react-redux';
import { deckSlice, selectedElementSelector } from '../../slices/deck-slice';
import { BoxFormatControls } from './box-format-controls';
import { isBoxElement, isMdElement } from './validators';
import { MdFormatControls } from './md-format-controls';

export const FormatInspector = () => {
  const dispatch = useDispatch();
  const selectedElement = useSelector(selectedElementSelector);
  const handleElementChanged = useCallback(
    (sender) => dispatch(deckSlice.actions.editableElementChanged(sender)),
    [dispatch]
  );

  const props = {
    editableElementChanged: handleElementChanged,
    selectedElement: selectedElement
  };

  return (
    <Pane>
      {(() => {
        if (isBoxElement(selectedElement)) {
          return <BoxFormatControls {...props} />;
        } else if (isMdElement(selectedElement)) {
          return <MdFormatControls {...props} />;
        }
      })()}
    </Pane>
  );
};
