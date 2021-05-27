import { FormField, Switch, TextInputField } from 'evergreen-ui';
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
import { useToggle } from '../../hooks';
import styled from 'styled-components';

export const BorderFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const borderStyle = selectedElement?.props?.borderStyle || BORDER_STYLES.NONE;
  const borderWidth = selectedElement?.props?.borderWidth || '';
  const borderRadius = selectedElement?.props?.borderRadius || '';
  const hasBorderChecked = selectedElement?.props?.hasBorder;

  const [inputState, setInputState] = useState({
    borderWidth,
    borderRadius
  });

  const [hasBorder, toggleHasBorder] = useToggle(hasBorderChecked);

  const [borderColor, setBorderColor] = useState('');

  useEffect(() => {
    const selectedBorderColor = selectedElement?.props?.borderColor;
    setBorderColor(selectedBorderColor || '');
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
      <Container label="Borders">
        <SwitchContainer label="Add borders">
          <Switch
            checked={hasBorder}
            onChange={() => {
              handleValueChanged('hasBorder', !hasBorder);
              toggleHasBorder();
            }}
          />
        </SwitchContainer>

        {!hasBorder ? (
          <></>
        ) : (
          <>
            <SplitContainer>
              <SelectInput
                label="Border Style"
                value={borderStyle}
                options={convertOptionsToObjects(BORDER_STYLE_OPTIONS)}
                onValueChange={(value) =>
                  handleValueChanged(BORDER_COMPONENT_PROPS.BORDER_STYLE, value)
                }
              />

              <TextInputField
                label="Border Width"
                value={inputState.borderWidth}
                onBlur={(e: FocusEvent<HTMLInputElement>) => {
                  const { value } = e.target;
                  if (isValidCSSSize(value)) {
                    setInputState({ ...inputState, borderWidth: value });
                    handleValueChanged(
                      BORDER_COMPONENT_PROPS.BORDER_WIDTH,
                      value
                    );
                  } else {
                    setInputState({ ...inputState, borderWidth });
                  }
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target;
                  if (isValidCSSSize(value)) {
                    setInputState({ ...inputState, borderWidth: value });
                    handleValueChanged(
                      BORDER_COMPONENT_PROPS.BORDER_WIDTH,
                      value
                    );
                  } else {
                    setInputState({ ...inputState, borderWidth: value });
                  }
                }}
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
            />

            <TextInputField
              label="Border Radius"
              value={inputState.borderRadius}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (isValidCSSSize(value)) {
                  setInputState({ ...inputState, borderRadius: value });
                  handleValueChanged(
                    BORDER_COMPONENT_PROPS.BORDER_RADIUS,
                    value
                  );
                } else {
                  setInputState({ ...inputState, borderRadius });
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (isValidCSSSize(value)) {
                  setInputState({ ...inputState, borderRadius: value });
                  handleValueChanged(
                    BORDER_COMPONENT_PROPS.BORDER_RADIUS,
                    value
                  );
                } else {
                  setInputState({ ...inputState, borderRadius: value });
                }
              }}
            />
          </>
        )}
      </Container>
    </>
  );
};

const Container = styled(FormField)`
  display: grid;
  margin-top: 10px;

  > div {
    margin-bottom: 12px;

    label {
      font-weight: 400;
    }
  }
`;

const SwitchContainer = styled(FormField)`
  display: flex;
  flex-direction: row;
  align-items: center;

  > label {
    margin-right: 10px;
  }
`;

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  width: calc(100% - 10px);

  > div {
    margin-bottom: 6px;
  }
`;
