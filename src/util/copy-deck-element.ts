import { v4 } from 'uuid';
import { DeckElement, DeckElementMap } from '../types/deck-elements';

export const copyDeckElement = (
  elementId: string,
  getElementById: (id: string) => DeckElement | undefined
) => {
  const elementToCopy = getElementById(elementId);
  if (!elementToCopy) {
    return;
  }
  let elementChildren: {
    copiedChildrenIds: string[];
    copiedChildrenElements: DeckElementMap;
  } = { copiedChildrenIds: [], copiedChildrenElements: {} };

  if (elementToCopy.children && Array.isArray(elementToCopy.children)) {
    elementChildren = elementToCopy.children.reduce((accum, childElementId) => {
      const copiedChild = copyDeckElement(childElementId, getElementById);
      if (!copiedChild) {
        return accum;
      }

      accum.copiedChildrenIds = [...accum.copiedChildrenIds, copiedChild.id];
      accum.copiedChildrenElements = {
        ...accum.copiedChildrenElements,
        ...copiedChild.elements
      };
      return accum;
    }, elementChildren);
  }
  let copiedElement: DeckElement;

  if (elementToCopy.children && Array.isArray(elementToCopy.children)) {
    copiedElement = {
      ...elementToCopy,
      id: v4(),
      children: elementChildren.copiedChildrenIds
    };
  } else {
    copiedElement = {
      ...elementToCopy,
      id: v4()
    };
  }

  return {
    id: copiedElement.id,
    elements: {
      [copiedElement.id]: copiedElement,
      ...elementChildren.copiedChildrenElements
    }
  };
};
