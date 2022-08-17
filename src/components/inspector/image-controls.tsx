import React, { ChangeEvent } from 'react';
import { ElementControlsProps } from './element-controls-props';
import {
  Button,
  CrossIcon,
  IconButton,
  Popover,
  TextInputField,
  TickIcon
} from 'evergreen-ui';
import { isValidUrl } from '../../util/is-valid-url';
import { FreeMovementControls } from './free-movement-controls';
import { ResizeControls } from './resize-controls';
import styled from 'styled-components';
import Cropper from 'cropperjs';

const CropperImageContainer = styled.div`
  max-width: 400px;
  height: 100%;
`;

const CropperImage = styled.img`
  display: block;
  max-width: 100%;
`;

const CropperButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px;
  box-sizing: border-box;

  button:first-child {
    margin-right: 4px;
  }
`;

const CropButton = styled(Button)`
  width: 100%;
  justify-content: center;
`;

export const ImageControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const desiredSrc = selectedElement?.props?.src || '';
  const [inputState, setInputState] = React.useState({
    desiredSrc
  });
  const [isCropModalOpen, setCropModalOpen] = React.useState<boolean>(false);
  const [dialogImageRef, setDialogImageRef] =
    React.useState<HTMLImageElement | null>();
  const cropperInstance = React.useRef<Cropper | undefined>();
  React.useEffect(() => {
    if (dialogImageRef && isCropModalOpen) {
      cropperInstance.current = new Cropper(dialogImageRef, {
        // aspectRatio: 16 / 9
      });
    }
  }, [dialogImageRef, isCropModalOpen]);

  const handleValueChanged = React.useCallback(
    (propName: string, value: unknown) => {
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
      <Popover
        onOpen={() => setCropModalOpen(true)}
        onClose={() => {
          setCropModalOpen(false);
        }}
        content={({ close }) => (
          <CropperImageContainer>
            <CropperImage
              src={selectedElement?.props?.src}
              ref={(r) => setDialogImageRef(r)}
            />
            <CropperButtonContainer>
              <IconButton
                onClick={() => {
                  close();
                  const e = cropperInstance.current?.getCroppedCanvas();

                  if (!e) {
                    return console.warn('Could not crop the image.');
                  }
                  handleValueChanged('croppedSrc', e.toDataURL());
                }}
                icon={TickIcon}
                height={48}
              />
              <IconButton
                onClick={() => {
                  close();
                }}
                icon={CrossIcon}
                height={48}
              />
            </CropperButtonContainer>
          </CropperImageContainer>
        )}
      >
        <CropButton>Crop Image</CropButton>
      </Popover>
    </div>
  );
};
