import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useState
} from 'react';
import { ElementControlsProps } from './element-controls-props';
import {
  ALIGN_ITEMS,
  ALIGN_ITEMS_OPTIONS,
  FLEX_COMPONENT_PROPS,
  FLEX_DIRECTION,
  FLEX_DIRECTION_OPTIONS,
  JUSTIFY_CONTENT,
  JUSTIFY_CONTENT_OPTIONS
} from '../../constants/flex-parent-options';
import { SegmentedInput } from '../inputs/segmented';
import { SelectInput } from '../inputs/select';
import { useToggle } from '../../hooks';
import { useRootSelector } from '../../store';
import { themeSelector } from '../../slices/deck-slice';
import styled from 'styled-components';
import { FormField, Switch, TextInputField } from 'evergreen-ui';
import { isValidCSSSize } from '../../util/is-valid-css-size';

export const FlexParentControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const flexDirectionValue =
    selectedElement?.props?.flexDirection || FLEX_DIRECTION.column;
  const justifyContentValue =
    selectedElement?.props?.justifyContent || JUSTIFY_CONTENT.CENTER;
  const alignItemsValue =
    selectedElement?.props?.alignItems || ALIGN_ITEMS.CENTER;

  const themeValues = useRootSelector(themeSelector);

  const padding =
    selectedElement?.props?.padding || `${themeValues.space[0]}px`;
  const horizontalPadding =
    selectedElement?.props?.[FLEX_COMPONENT_PROPS.PADDING_HORIZONTAL] ||
    `${themeValues.space[0]}px`;
  const verticalPadding =
    selectedElement?.props?.[FLEX_COMPONENT_PROPS.PADDING_VERTICAL] ||
    `${themeValues.space[0]}px`;
  const isSinglePadding = !Boolean(
    selectedElement?.props?.[FLEX_COMPONENT_PROPS.PADDING_VERTICAL] ||
      selectedElement?.props?.[FLEX_COMPONENT_PROPS.PADDING_HORIZONTAL]
  );

  const [paddingDoubleValue, togglePaddingDoubleValue] = useToggle(
    isSinglePadding
  );
  const [inputState, setInputState] = useState({
    padding,
    horizontalPadding,
    verticalPadding
  });

  const onToggle = () => {
    if (!paddingDoubleValue) {
      // clear paddingX & paddingY. Set padding to last input value
      const {
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        paddingX,
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        paddingY,
        ...rest
      } = selectedElement?.props?.componentProps;
      editableElementChanged({
        componentProps: {
          ...rest,
          padding: inputState.padding
        }
      });
    } else {
      // clear padding. Set horizontal & vertical padding to last input values
      editableElementChanged({
        componentProps: {
          ...selectedElement?.props?.componentProps,
          padding: '',
          paddingX: inputState.horizontalPadding,
          paddingY: inputState.verticalPadding
        }
      });
    }
  };

  const convertOptionsToObjects = (options: any) => {
    return Object.values(options).map((op: any) => ({
      value: op,
      // Capitalize first letter of option
      title: op.trim().replace(/^\w/, (c: string) => c.toUpperCase())
    }));
  };

  const handleValueChanged = useCallback(
    (propName: string, value) => editableElementChanged({ [propName]: value }),
    [editableElementChanged]
  );

  return (
    <>
      <SegmentedInput
        label="Layout Content"
        options={Object.values(FLEX_DIRECTION_OPTIONS)}
        value={flexDirectionValue}
        onChange={(value) =>
          handleValueChanged(FLEX_COMPONENT_PROPS.FLEX_DIRECTION, value)
        }
      />
      <SplitContainer>
        <SelectInput
          label="Justify Content"
          value={justifyContentValue}
          options={convertOptionsToObjects(JUSTIFY_CONTENT_OPTIONS)}
          onValueChange={(value) =>
            handleValueChanged(FLEX_COMPONENT_PROPS.JUSTIFY_CONTENT, value)
          }
        />
        <SelectInput
          label="Align Items"
          value={alignItemsValue}
          options={convertOptionsToObjects(ALIGN_ITEMS_OPTIONS)}
          onValueChange={(value) =>
            handleValueChanged(FLEX_COMPONENT_PROPS.ALIGN_ITEMS, value)
          }
        />
      </SplitContainer>

      <Container label="Padding">
        <SwitchContainer label="Use single value for padding">
          <Switch
            checked={paddingDoubleValue}
            onChange={() => {
              togglePaddingDoubleValue();
              onToggle();
            }}
          />
        </SwitchContainer>

        {paddingDoubleValue ? (
          <TextInputField
            label="Padding size"
            value={inputState.padding}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              const { value } = e.target;
              if (isValidCSSSize(value)) {
                setInputState({ ...inputState, padding: value });
                handleValueChanged(FLEX_COMPONENT_PROPS.PADDING, value);
              } else {
                setInputState({ ...inputState, padding });
              }
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              if (isValidCSSSize(value)) {
                setInputState({ ...inputState, padding: value });
                handleValueChanged(FLEX_COMPONENT_PROPS.PADDING, value);
              } else {
                setInputState({ ...inputState, padding: value });
              }
            }}
          />
        ) : (
          <>
            <TextInputField
              label="Horizontal padding size"
              value={inputState.horizontalPadding}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (isValidCSSSize(value)) {
                  setInputState({ ...inputState, horizontalPadding: value });
                  handleValueChanged(
                    FLEX_COMPONENT_PROPS.PADDING_HORIZONTAL,
                    value
                  );
                } else {
                  setInputState({ ...inputState, padding });
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (isValidCSSSize(value)) {
                  setInputState({ ...inputState, horizontalPadding: value });
                  handleValueChanged(
                    FLEX_COMPONENT_PROPS.PADDING_HORIZONTAL,
                    value
                  );
                } else {
                  setInputState({ ...inputState, horizontalPadding: value });
                }
              }}
            />
            <TextInputField
              label="Vertical padding size"
              value={inputState.verticalPadding}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (isValidCSSSize(value)) {
                  setInputState({ ...inputState, verticalPadding: value });
                  handleValueChanged(
                    FLEX_COMPONENT_PROPS.PADDING_VERTICAL,
                    value
                  );
                } else {
                  setInputState({ ...inputState, verticalPadding });
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                if (isValidCSSSize(value)) {
                  setInputState({ ...inputState, verticalPadding: value });
                  handleValueChanged(
                    FLEX_COMPONENT_PROPS.PADDING_VERTICAL,
                    value
                  );
                } else {
                  setInputState({ ...inputState, verticalPadding: value });
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
