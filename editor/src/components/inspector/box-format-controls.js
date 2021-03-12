import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ColorPickerInput } from '../inputs/color';

export const BoxFormatControls = ({
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

BoxFormatControls.propTypes = {
  selectedElement: PropTypes.object,
  editableElementChanged: PropTypes.func
};
