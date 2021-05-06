import { DeckElement } from '../types/deck-elements';

export const getChildren = (
  trees: string[],
  getElementById: (id: string) => DeckElement | undefined
): string[] => {
  let elementsToDelete: string[] = [];
  let elementToDelete: DeckElement | undefined;
  trees.forEach((id) => {
    elementToDelete = getElementById(id);
    if (!elementToDelete) {
      return elementsToDelete;
    }
    let children: string[];

    if (elementToDelete.children && Array.isArray(elementToDelete.children)) {
      children = getChildren(elementToDelete.children, getElementById);
      elementsToDelete = [...elementsToDelete, ...children, elementToDelete.id];
    } else {
      elementsToDelete = [...elementsToDelete, elementToDelete.id];
    }
  });

  return elementsToDelete;
};
