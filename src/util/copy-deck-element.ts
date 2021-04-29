import { v4 } from 'uuid';
import { DeckElement, DeckElementMap } from '../types/deck-elements';

export const copyDeckElement = (elementId: string, getElementById: (id: string) => DeckElement | undefined) => {
  const elementToCopy = getElementById(elementId);
  if (!elementToCopy) {
    return;
  }

  const { copiedChildrenIds, copiedChildrenElements } = elementToCopy.children.reduce((accum, childElementId) => {
    const copiedChild = copyDeckElement(childElementId, getElementById);
    if (!copiedChild) {
      return accum;
    }

    accum.copiedChildrenIds = [...accum.copiedChildrenIds, copiedChild.id];
    accum.copiedChildrenElements = { ...accum.copiedChildrenElements, ...copiedChild.elements };
    return accum;
  }, { copiedChildrenIds: [], copiedChildrenElements: {} });

  const copiedElement = {
    ...elementToCopy,
    id: v4(),
    children: copiedChildrenIds
  };

  return {
    id: copiedElement.id,
    elements: {
      [copiedElement.id]: copiedElement,
      ...copiedChildrenElements
    }
  }
};
