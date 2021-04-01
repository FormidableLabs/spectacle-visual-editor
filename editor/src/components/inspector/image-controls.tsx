import React, { ChangeEvent } from 'react';
import { ElementControlsProps } from './element-controls-props';
import { TextInputField } from 'evergreen-ui';
import { isValidUrl } from '../../util/is-valid-url';

export const ImageControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const [desiredSrc, setDesiredSrc] = React.useState(
    selectedElement?.props?.src || ''
  );

  // If desired src is valid, update the element in the store.
  React.useEffect(() => {
    if (isValidUrl(desiredSrc)) {
      editableElementChanged({ src: desiredSrc });
    }
  }, [desiredSrc, editableElementChanged]);

  return (
    <div>
      <TextInputField
        label="Image URL"
        placeholder="https://..."
        value={desiredSrc}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setDesiredSrc(e.target.value)
        }
        onBlur={() => {
          if (!isValidUrl(desiredSrc)) {
            setDesiredSrc(selectedElement?.props?.src || '');
          }
        }}
      />
    </div>
  );
};
