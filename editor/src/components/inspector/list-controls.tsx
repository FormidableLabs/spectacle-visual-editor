import React from 'react';
import { DeckElement } from '../../types/deck-elements';
import { Switch } from 'evergreen-ui';

interface Props {
  selectedElement: DeckElement | null;
  editableElementChanged(element: Partial<DeckElement['props']>): void;
}

export const ListControls: React.FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  const animateListItems = selectedElement?.props?.animateListItems || false;

  const onToggle = () => {
    editableElementChanged({
      animateListItems: !animateListItems
    });
  };

  return (
    <div>
      <div>Animate list items?</div>
      <Switch checked={animateListItems} onChange={onToggle} />
    </div>
  );
};
