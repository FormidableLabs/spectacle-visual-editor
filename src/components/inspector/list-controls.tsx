import React from 'react';
import { ConstructedDeckElement } from '../../types/deck-elements';
import { FormField, Switch } from 'evergreen-ui';
import { SelectInput } from '../inputs/select';
import { cloneDeep, set } from 'lodash-es';
import styled from 'styled-components';
import { LIST_STYLE_TYPE_OPTIONS } from '../../constants/list-style-type-options';

interface Props {
  selectedElement: ConstructedDeckElement | null;
  editableElementChanged(element: Partial<ConstructedDeckElement['props']>): void;
}

export const ListControls: React.FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  const shouldAnimateListItems =
    selectedElement?.props?.animateListItems || false;
  const listStyleType =
    selectedElement?.props?.componentProps?.listStyleType || 'disc';

  const onToggleAnimatedListItems = () => {
    editableElementChanged({
      animateListItems: !shouldAnimateListItems
    });
  };

  const onListStyleTypeChanged = (val: string) => {
    if (selectedElement) {
      const newEl = set(
        cloneDeep(selectedElement),
        'componentProps.listStyleType',
        val
      );
      editableElementChanged(newEl);
    }
  };

  return (
    <Container>
      <FormField label="Animate list items?">
        <Switch
          checked={shouldAnimateListItems}
          onChange={onToggleAnimatedListItems}
        />
      </FormField>
      <SelectInput
        label="List Style Type"
        value={listStyleType}
        onValueChange={onListStyleTypeChanged}
        options={LIST_STYLE_TYPE_OPTIONS.map((op) => ({
          value: op,
          title: op
        }))}
      />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
`;
