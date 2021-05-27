import React, { useCallback } from 'react';
import { Pane } from './inspector-styles';
import { useDispatch, useSelector } from 'react-redux';
import { deckSlice, selectedElementSelector } from '../../slices/deck-slice';
import { BoxFormatControls } from './box-format-controls';
import {
  isBoxElement,
  isImageElement,
  isMdElement,
  isCodePaneElement,
  isGridElement
} from './validators';
import { MdFormatControls } from './md-format-controls';
import { ImageControls } from './image-controls';
import { FlexDirectionControls } from './flex-direction-controls';
import { CodePaneFormatControls } from './codepane-format-controls';
import { GridFormatControls } from './grid-format-controls';
import { FreeMovementControls } from './free-movement-controls';

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
    <Pane padding={10}>
      {(() => {
        if (isBoxElement(selectedElement)) {
          return (
            <>
              <FreeMovementControls {...props} />
              <BoxFormatControls {...props} />
              <FlexDirectionControls {...props} />
            </>
          );
        } else if (isGridElement(selectedElement)) {
          return <GridFormatControls {...props} />;
        } else if (isMdElement(selectedElement)) {
          return <MdFormatControls {...props} />;
        } else if (isImageElement(selectedElement)) {
          return <ImageControls {...props} />;
        } else if (isCodePaneElement(selectedElement)) {
          return <CodePaneFormatControls {...props} />;
        }
      })()}
    </Pane>
  );
};
