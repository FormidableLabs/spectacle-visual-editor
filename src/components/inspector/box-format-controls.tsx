import React, { useEffect, useState } from 'react';
import { ColorPickerInput } from '../inputs/color';
import { ElementControlsProps } from './element-controls-props';
import { FreeMovementControls } from './free-movement-controls';

export const BoxFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    const selectedBackgroundColor = selectedElement?.props?.backgroundColor;
    setBackgroundColor(selectedBackgroundColor || '');
  }, [selectedElement]);

  return (
    <>
      <FreeMovementControls {...{ selectedElement, editableElementChanged }} />
      <ColorPickerInput
        disabled={!selectedElement?.props?.backgroundColor}
        onChangeInput={setBackgroundColor}
        label="Background Color"
        onUpdateValue={(value) =>
          editableElementChanged({
            backgroundColor: value
          })
        }
        validValue={selectedElement?.props?.backgroundColor}
        value={backgroundColor}
      />
    </>
  );
};
