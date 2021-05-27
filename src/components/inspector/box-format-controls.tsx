import React, { useEffect, useState } from 'react';
import { ColorPickerInput } from '../inputs/color';
import { Accordion } from '../user-interface/accordion';
import { BorderFormatControls } from './border-format-controls';
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
      <Accordion label="Styling">
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
        <BorderFormatControls
          selectedElement={selectedElement}
          editableElementChanged={editableElementChanged}
        />
      </Accordion>
    </>
  );
};
