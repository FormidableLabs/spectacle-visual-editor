import { TextInputField } from 'evergreen-ui';
import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  BORDER_COMPONENT_PROPS,
  BORDER_STYLES,
  BORDER_STYLE_OPTIONS
} from '../../constants/flex-box-options';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { ColorPickerInput } from '../inputs/color';
import { SelectInput } from '../inputs/select';
import { ElementControlsProps } from './element-controls-props';

export const BoxFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  /* borderWidth, borderStyle, borderColor, and borderRadius */
  const borderStyle = selectedElement?.props?.borderStyle || BORDER_STYLES.NONE;
  const borderWidth = selectedElement?.props?.borderWidth || '';
  const borderRadius = selectedElement?.props?.borderRadius || '';

  const [inputState, setInputState] = useState({
    borderWidth,
    borderRadius
  });

  const [backgroundColor, setBackgroundColor] = useState('');
  const [borderColor, setBorderColor] = useState('#FFFFFF');

  useEffect(() => {
    const selectedBackgroundColor = selectedElement?.props?.backgroundColor;
    const selectedBorderColor = selectedElement?.props?.borderColor;
    setBackgroundColor(selectedBackgroundColor || '');
    setBorderColor(selectedBorderColor || '#FFFFFF');
  }, [selectedElement]);

  const handleValueChanged = useCallback(
    (propName: string, value) => editableElementChanged({ [propName]: value }),
    [editableElementChanged]
  );

  const convertOptionsToObjects = (options: any) => {
    return Object.values(options).map((op: any) => ({
      value: op,
      // Capitalize first letter of option
      title: op.trim().replace(/^\w/, (c: string) => c.toUpperCase())
    }));
  };

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
      <SelectInput
        label="Border Style"
        value={borderStyle}
        options={convertOptionsToObjects(BORDER_STYLE_OPTIONS)}
        onValueChange={(value) =>
          handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_STYLE, value)
        }
      />
      <ColorPickerInput
        onChangeInput={setBorderColor}
        label="Border Color"
        onUpdateValue={(value) =>
          editableElementChanged({
            borderColor: value
          })
        }
        validValue={selectedElement?.props?.borderColor}
        value={borderColor}
      />
      <TextInputField
        label="Border Width"
        value={inputState.borderWidth}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, borderWidth: value });
            handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_WIDTH, value);
          } else {
            setInputState({ ...inputState, borderWidth });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, borderWidth: value });
            handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_WIDTH, value);
          } else {
            setInputState({ ...inputState, borderWidth: value });
          }
        }}
      />

      <TextInputField
        label="Border Radius"
        value={inputState.borderRadius}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, borderRadius: value });
            handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_RADIUS, value);
          } else {
            setInputState({ ...inputState, borderRadius });
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (isValidCSSSize(value)) {
            setInputState({ ...inputState, borderRadius: value });
            handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_RADIUS, value);
          } else {
            setInputState({ ...inputState, borderRadius: value });
          }
        }}
      />
    </>
  );
};
