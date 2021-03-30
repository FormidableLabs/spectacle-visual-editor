import React from 'react';
import { DeckElement } from '../../types/deck-elements';
import { FormField, Switch } from 'evergreen-ui';
import { SelectInput } from '../inputs/select';
import { set, cloneDeep } from 'lodash-es';

interface Props {
  selectedElement: DeckElement | null;
  editableElementChanged(element: Partial<DeckElement['props']>): void;
}

export const ListControls: React.FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  const shouldAnimateListItems =
    selectedElement?.props?.animateListItems || false;
  const listStyleType =
    selectedElement?.props?.componentProps?.listStyleType || '';

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
    <div>
      <FormField label="Animate list items?">
        <Switch
          checked={shouldAnimateListItems}
          onChange={onToggleAnimatedListItems}
        />
        <SelectInput
          label="List Style Type"
          value={listStyleType}
          onValueChange={onListStyleTypeChanged}
          options={ListStyleOptions.map((op) => ({
            value: op,
            title: op
          }))}
        />
      </FormField>
    </div>
  );
};

const ListStyleOptions = [
  'none',
  'disc',
  'circle',
  'square',
  'lower-latin',
  'upper-latin',
  'lower-roman',
  'upper-roman',
  'lower-greek',
  'decimal'
];
