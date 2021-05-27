import React, { useEffect, useState } from 'react';
import { ColorPickerInput } from '../inputs/color';
import { ElementControlsProps } from './element-controls-props';

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
