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
import styled from 'styled-components';

export const BorderFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const borderStyle = selectedElement?.props?.borderStyle || BORDER_STYLES.NONE;
  const borderWidth = selectedElement?.props?.borderWidth || '';
  const borderRadius = selectedElement?.props?.borderRadius || '';

  const [inputState, setInputState] = useState({
    borderWidth,
    borderRadius
  });

  const [borderColor, setBorderColor] = useState('');

  useEffect(() => {
    const selectedBorderColor = selectedElement?.props?.borderColor;
    setBorderColor(selectedBorderColor || '');
  }, [selectedElement]);

  const handleValueChanged = useCallback(
    (propName: string, value: unknown) => {
      editableElementChanged({ [propName]: value });
    },
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
      <SplitContainer>
        <SelectInput
          label="Border Style"
          value={borderStyle}
          options={convertOptionsToObjects(BORDER_STYLE_OPTIONS)}
          onValueChange={(value) => {
            if (value === BORDER_STYLES.NONE) {
              setInputState({
                borderWidth: '',
                borderRadius: inputState.borderRadius
              });
              handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_WIDTH, '');
            } else if (!inputState.borderWidth) {
              setInputState({
                borderWidth: '1px',
                borderRadius: inputState.borderRadius
              });
              handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_WIDTH, '1px');
            }
            handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_STYLE, value);
          }}
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
          disabled={borderStyle === BORDER_STYLES.NONE}
        />
      </SplitContainer>
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
        disabled={borderStyle === BORDER_STYLES.NONE}
      />

      <TextInputField
        label="Border Radius"
        description="Allows shorthand properties"
        value={inputState.borderRadius}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (
            value.split(/\s+/).every((term) => {
              return (
                isValidCSSSize(term) ||
                term === 'initial' ||
                term === 'inherit' ||
                term === 'unset'
              );
            }) &&
            value.split(/\s+/).length <= 4
          ) {
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

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  width: calc(100% - 10px);

  > div {
    margin-bottom: 6px;
  }
`;
