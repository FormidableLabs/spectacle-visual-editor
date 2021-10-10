import React, { ChangeEvent } from 'react';
import { ElementControlsProps } from './element-controls-props';
import { TextInputField } from 'evergreen-ui';
import { isValidUrl } from '../../util/is-valid-url';
import { FreeMovementControls } from './free-movement-controls';
import { ResizeControls } from './resize-controls';

export const ImageControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const desiredSrc = selectedElement?.props?.src || '';
  const [inputState, setInputState] = React.useState({
    desiredSrc
  });

  const handleValueChanged = React.useCallback(
    (propName: string, value) => {
      editableElementChanged({ [propName]: value });
    },
    [editableElementChanged]
  );

  return (
    <div>
      <FreeMovementControls {...{ selectedElement, editableElementChanged }} />
      <ResizeControls {...{ selectedElement, editableElementChanged }} />
      <TextInputField
        label="Image URL"
        placeholder="https://..."
        value={desiredSrc}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidUrl(value)) {
            setInputState({ ...inputState, desiredSrc: value });
            handleValueChanged('src', value);
          } else {
            setInputState({ ...inputState, desiredSrc: value });
          }
        }}
        onBlur={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidUrl(value)) {
            setInputState({ ...inputState, desiredSrc: value });
            handleValueChanged('src', value);
          } else {
            setInputState({ ...inputState, desiredSrc });
          }
        }}
      />
    </div>
  );
};
