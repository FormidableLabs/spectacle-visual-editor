import React, { ChangeEvent, FocusEvent, useCallback, useState } from 'react';
import { ElementControlsProps } from './element-controls-props';
import {
  ALIGN_ITEMS,
  ALIGN_ITEMS_OPTIONS,
  FLEX_COMPONENT_PROPS,
  FLEX_DIRECTION,
  FLEX_DIRECTION_OPTIONS,
  JUSTIFY_CONTENT,
  JUSTIFY_CONTENT_OPTIONS
} from '../../constants/flex-box-options';
import { SegmentedInput } from '../inputs/segmented';
import { SelectInput } from '../inputs/select';
import { useRootSelector } from '../../store';
import { themeSelector } from '../../slices/deck-slice';
import styled from 'styled-components';
import { TextInputField } from 'evergreen-ui';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { Accordion } from '../user-interface/accordion';

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

  const [inputState, setInputState] = useState({
    padding,
    horizontalPadding,
    verticalPadding
  });

  const convertOptionsToObjects = (options: any) => {
    return Object.values(options).map((op: any) => ({
      value: op,
      // Capitalize first letter of option
      title: op.trim().replace(/^\w/, (c: string) => c.toUpperCase())
    }));
  };

  const handleValueChanged = useCallback(
    (propName: string, value: unknown) =>
      editableElementChanged({ [propName]: value }),
    [editableElementChanged]
  );

  return (
    <>
      <Accordion label="Flex Options">
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
        <TextInputField
          label="Padding size"
          description="Allows shorthand properties"
          value={inputState.padding}
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
      </Accordion>
    </>
  );
};

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  width: calc(100% - 10px);
  margin-bottom: 18px;

  > div {
    margin-bottom: 6px;
  }
`;
