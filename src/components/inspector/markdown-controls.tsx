import React, { ChangeEvent, FocusEvent, useState } from 'react';
import { ConstructedDeckElement } from '../../types/deck-elements';
import { TextInputField } from 'evergreen-ui';
import { SelectInput } from '../inputs/select';
import styled from 'styled-components';
import {
  MD_COMPONENT_PROPS,
  LIST_FONT_WEIGHT_OPTIONS,
  LIST_TEXT_ALIGN_OPTIONS
} from '../../constants/md-style-options';
import { ColorPickerInput } from '../inputs/color';
import { useRootSelector } from '../../store';
import { themeSelector } from '../../slices/deck-slice';
import { isValidCSSSize } from '../../util/is-valid-css-size';
import { SegmentedInput } from '../inputs/segmented';

interface Props {
  selectedElement: ConstructedDeckElement | null;
  editableElementChanged(
    element: Partial<ConstructedDeckElement['props']>
  ): void;
}

export const MarkdownControls: React.FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  const themeValues = useRootSelector(themeSelector);
  const color: string =
    selectedElement?.props?.componentProps?.color || themeValues.colors.primary;
  const fontSize =
    selectedElement?.props?.componentProps?.fontSize ||
    themeValues.fontSizes.text;
  const fontWeight =
    selectedElement?.props?.componentProps?.fontWeight ||
    LIST_FONT_WEIGHT_OPTIONS.FOUR_HUNDRED;
  const textAlign =
    selectedElement?.props?.componentProps?.textAlign ||
    LIST_TEXT_ALIGN_OPTIONS.LEFT;
  const [inputState, setInputState] = useState({
    color,
    fontSize
  });

  const onChangeComponentProps = (
    propName: string,
    val: string | number | boolean
  ) => {
    if (selectedElement) {
      editableElementChanged({
        componentProps: {
          ...selectedElement.props?.componentProps,
          [propName]: val
        }
      });
    }
  };

  return (
    <Container>
      <ColorPickerInput
        label="Color"
        onUpdateValue={(value) =>
          onChangeComponentProps(MD_COMPONENT_PROPS.COLOR, value)
        }
        validValue={color}
        onChangeInput={(value) =>
          setInputState({ ...inputState, color: value })
        }
        value={inputState.color}
      />
      <SplitContainer>
        <TextInputField
          label="Font Size"
          value={inputState.fontSize}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (isValidCSSSize(value)) {
              setInputState({ ...inputState, fontSize: value });
              onChangeComponentProps(MD_COMPONENT_PROPS.FONT_SIZE, value);
            } else {
              setInputState({ ...inputState, fontSize });
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (isValidCSSSize(value)) {
              setInputState({ ...inputState, fontSize: value });
              onChangeComponentProps(MD_COMPONENT_PROPS.FONT_SIZE, value);
            } else {
              setInputState({ ...inputState, fontSize: value });
            }
          }}
        />
        <SelectInput
          label="Font Weight"
          value={fontWeight}
          options={Object.values(LIST_FONT_WEIGHT_OPTIONS).map((op) => ({
            value: op,
            title: op
          }))}
          onValueChange={(value) =>
            onChangeComponentProps(MD_COMPONENT_PROPS.FONT_WEIGHT, value)
          }
        />
      </SplitContainer>
      <SegmentedInput
        label="Text Align"
        options={Object.values(LIST_TEXT_ALIGN_OPTIONS)}
        value={textAlign}
        onChange={(value) =>
          onChangeComponentProps(MD_COMPONENT_PROPS.TEXT_ALIGN, value)
        }
      />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 10px;

  > div {
    margin-bottom: 6px;
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
