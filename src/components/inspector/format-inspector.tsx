import React from 'react';
import { Pane } from './inspector-styles';
import { useSelector } from 'react-redux';
import { selectedElementSelector } from '../../slices/deck-slice';
import { BoxFormatControls } from './box-format-controls';
import {
  isBoxElement,
  isImageElement,
  isMdElement,
  isCodePaneElement,
  isGridElement,
  isProgressElement,
  isFullScreenElement
} from './validators';
import { MdFormatControls } from './md-format-controls';
import { ImageControls } from './image-controls';
import { FlexParentControls } from './flex-parent-controls';
import { CodePaneFormatControls } from './codepane-format-controls';
import { GridFormatControls } from './grid-format-controls';
import { ProgressFormatControls } from './progress-format-controls';
import { FullScreenFormatControls } from './full-screen-format-controls';
import { useEditElement } from '../../hooks/use-edit-element';

export const FormatInspector = () => {
  const handleElementChanged = useEditElement();
  const selectedElement = useSelector(selectedElementSelector);

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
              <BoxFormatControls {...props} />
              <FlexParentControls {...props} />
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
        } else if (isProgressElement(selectedElement)) {
          return <ProgressFormatControls {...props} />;
        } else if (isFullScreenElement(selectedElement)) {
          return <FullScreenFormatControls {...props} />;
        }
      })()}
    </Pane>
  );
};
