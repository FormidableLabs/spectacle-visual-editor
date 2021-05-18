import React from 'react';
import { ConstructedDeckElement } from '../../types/deck-elements';
import { FormField, Switch } from 'evergreen-ui';
import { SelectInput } from '../inputs/select';
import styled from 'styled-components';
import {
  LIST_STYLE_TYPE_OPTIONS,
  MD_COMPONENT_PROPS
} from '../../constants/md-style-options';

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
  const shouldAnimateListItems =
    selectedElement?.props?.animateListItems || false;
  const listStyleType =
    selectedElement?.props?.componentProps?.listStyleType ||
    LIST_STYLE_TYPE_OPTIONS.DISC;

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
      <SelectInput
        label="List Style Type"
        value={listStyleType}
        onValueChange={(value) =>
          onChangeComponentProps(MD_COMPONENT_PROPS.LIST_STYLE_TYPE, value)
        }
        options={Object.values(LIST_STYLE_TYPE_OPTIONS).map((op) => ({
          value: op,
          // Capitalize first letter of option
          title: op.trim().replace(/^\w/, (c) => c.toUpperCase())
        }))}
      />
      <SwitchContainer label="Animate list items">
        <Switch
          checked={shouldAnimateListItems}
          onChange={onToggleAnimatedListItems}
        />
      </SwitchContainer>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 10px;
`;

const SwitchContainer = styled(FormField)`
  display: flex;
  flex-direction: row;
  align-items: center;

  > label {
    margin-right: 10px;
  }
`;