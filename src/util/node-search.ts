import { DeckElement, CopiedDeckElement } from '../types/deck-elements';

export const searchTreeForNode = (
  tree: DeckElement[],
  value: string
): DeckElement | null => {
  let foundNode: DeckElement | null = null;

  for (let leaf of tree) {
    if (leaf.id === value) {
      foundNode = leaf;
      break;
    }
  }

  if (foundNode === null) {
    for (let leaf of tree) {
      if (Array.isArray(leaf.children) && leaf.children.length > 0) {
        foundNode = searchTreeForNode(leaf.children, value);
      }
    }
  }

  return foundNode;
};

export const deleteInTreeForNode = (tree: DeckElement[], value: string) => {
  for (let [index, leaf] of Object.entries(tree)) {
    if (leaf.id === value) {
      tree.splice(Number(index), 1);
      return;
    }
  }

  for (let leaf of tree) {
    if (Array.isArray(leaf.children) && leaf.children.length > 0) {
      deleteInTreeForNode(leaf.children, value);
    }
  }
};

export const copyNode = (element: DeckElement): CopiedDeckElement => {
  let copiedElement: CopiedDeckElement;
  if (Array.isArray(element.children) && element.children.length > 0) {
    copiedElement = { ...element, children: [] };
  } else {
    copiedElement = { ...element };
  }
  copiedElement.id = null;

  if (Array.isArray(element.children) && element.children.length > 0) {
    element.children.forEach((child) => {
      const nodeWithoutIds = copyNode(child);
      (copiedElement.children as DeckElement[]).push(
        nodeWithoutIds as DeckElement
      );
    });
  }

  return copiedElement;
};
