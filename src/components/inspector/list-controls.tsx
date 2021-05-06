import React, { ChangeEvent, FocusEvent, useState } from 'react';
import { ConstructedDeckElement } from '../../types/deck-elements';
import { FormField, Switch, TextInputField } from 'evergreen-ui';
import { SelectInput } from '../inputs/select';
import styled from 'styled-components';
import {
  LIST_STYLE_TYPE_OPTIONS,
  LIST_COMPONENT_PROPS,
  LIST_FONT_WEIGHT_OPTIONS,
  LIST_TEXT_ALIGN_OPTIONS
} from '../../constants/list-style-options';
import { ColorPickerInput } from '../inputs/color';
import { useRootSelector } from '../../store';
import { themeSelector } from '../../slices/deck-slice';

interface Props {
  selectedElement: ConstructedDeckElement | null;
  editableElementChanged(
    element: Partial<ConstructedDeckElement['props']>
  ): void;
}

export const ListControls: React.FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  const themeValues = useRootSelector(themeSelector);
  const shouldAnimateListItems =
    selectedElement?.props?.animateListItems || false;
  const listStyleType =
    selectedElement?.props?.componentProps?.listStyleType ||
    LIST_STYLE_TYPE_OPTIONS.DISC;
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

  const onToggleAnimatedListItems = () => {
    editableElementChanged({
      animateListItems: !shouldAnimateListItems
    });
  };

  const onChangeComponentProps = (propName: string, val: string) => {
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
          onChangeComponentProps(LIST_COMPONENT_PROPS.COLOR, value)
        }
        validValue={color}
        onChangeInput={(value) =>
          setInputState({ ...inputState, color: value })
        }
        value={inputState.color}
      />
      <TextInputField
        label="Font Size"
        value={inputState.fontSize}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (!/^\d+px$/g.test(value)) {
            onChangeComponentProps(LIST_COMPONENT_PROPS.FONT_SIZE, fontSize);
            setInputState({ ...inputState, fontSize });
          } else {
            onChangeComponentProps(LIST_COMPONENT_PROPS.FONT_SIZE, value);
          }
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputState({ ...inputState, fontSize: e.target.value })
        }
      />
      <SelectInput
        label="Font Weight"
        value={fontWeight}
        options={Object.values(LIST_FONT_WEIGHT_OPTIONS).map((op) => ({
          value: op,
          title: op
        }))}
        onValueChange={(value) =>
          onChangeComponentProps(LIST_COMPONENT_PROPS.FONT_WEIGHT, value)
        }
      />
      <SelectInput
        label="Text Align"
        value={textAlign}
        options={Object.values(LIST_TEXT_ALIGN_OPTIONS).map((op) => ({
          value: op,
          title: op
        }))}
        onValueChange={(value) =>
          onChangeComponentProps(LIST_COMPONENT_PROPS.TEXT_ALIGN, value)
        }
      />
      <SelectInput
        label="List Style Type"
        value={listStyleType}
        onValueChange={(value) =>
          onChangeComponentProps(LIST_COMPONENT_PROPS.LIST_STYLE_TYPE, value)
        }
        options={Object.values(LIST_STYLE_TYPE_OPTIONS).map((op) => ({
          value: op,
          title: op
        }))}
      />
      <FormField label="Animate list items?">
        <Switch
          checked={shouldAnimateListItems}
          onChange={onToggleAnimatedListItems}
        />
      </FormField>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 10px;
`;
