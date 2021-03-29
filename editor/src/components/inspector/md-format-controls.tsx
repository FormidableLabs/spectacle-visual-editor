import React from 'react';
import { MdInput } from '../inputs/md';
import { DeckElement } from '../../types/deck-elements';

interface Props {
  selectedElement: DeckElement | null;
  editableElementChanged(element: Partial<DeckElement>): void;
}

export const MdFormatControls: React.FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  return (
    <React.Fragment>
      <MdInput
        label="Content"
        value={String(selectedElement?.children)}
        onValueChange={(val) => editableElementChanged({ children: val })}
      />
    </React.Fragment>
  );
};
