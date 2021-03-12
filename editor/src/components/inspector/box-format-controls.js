import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextInputField } from 'evergreen-ui';
import { isValidCSSColor } from './validators';

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
      <TextInputField
        label="Background Color"
        inputHeight={24}
        disabled={!selectedElement?.props?.backgroundColor}
        value={backgroundColor}
        onChange={(e) => {
          setBackgroundColor(e.target.value);
          if (!isValidCSSColor(e.target.value)) {
            return;
          }
          editableElementChanged({
            backgroundColor: e.target.value
          });
        }}
      />
    </>
  );
};

BoxFormatControls.propTypes = {
  selectedElement: PropTypes.object,
  editableElementChanged: PropTypes.func
};
