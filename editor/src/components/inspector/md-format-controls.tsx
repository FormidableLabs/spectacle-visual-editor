import React from 'react';
import { MdInput } from '../inputs/md';
import { DeckElement } from '../../types/deck-elements';
import { useThrottleFn } from 'react-use';
import { doesMdContainList } from '../../util/does-md-contain-list';
import { ListControls } from './list-controls';

interface Props {
  selectedElement: DeckElement | null;
  editableElementChanged(element: Partial<DeckElement>): void;
}

export const MdFormatControls: React.FC<Props> = ({
  selectedElement,
  editableElementChanged
}) => {
  /**
   * Since doing RegExp checking isn't "free", and some users type fast,
   * we'll throttle this check to once every 500ms.
   */
  const doesContentContainList = useThrottleFn(
    (el) => doesMdContainList(String(el?.children)),
    500,
    [selectedElement]
  );

  return (
    <React.Fragment>
      <MdInput
        label="Content"
        value={String(selectedElement?.children)}
        onValueChange={(val) => editableElementChanged({ children: val })}
      />
      {doesContentContainList && (
        <ListControls {...{ selectedElement, editableElementChanged }} />
      )}
    </React.Fragment>
  );
};
