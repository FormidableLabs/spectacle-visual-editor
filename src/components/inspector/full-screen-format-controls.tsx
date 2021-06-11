import React from 'react';
import { ElementControlsProps } from './element-controls-props';
import { FreeMovementControls } from './free-movement-controls';

export const FullScreenFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  return (
    <>
      <FreeMovementControls {...{ selectedElement, editableElementChanged }} />
    </>
  );
};
