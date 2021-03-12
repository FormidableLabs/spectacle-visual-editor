import React, { useState } from 'react';
import { ColorPickerInput } from '../components';

export default {
  title: 'Components/Inputs/Color',
  component: ColorPickerInput
};

export const Primary = () => {
  const [value, setValue] = useState('#123abc');
  const [validValue, setValidValue] = useState('#123abc');
  return (
    <ColorPickerInput
      label="Primary Color"
      value={value}
      validValue={validValue}
      onChangeInput={setValue}
      onUpdateValue={setValidValue}
    />
  );
};
