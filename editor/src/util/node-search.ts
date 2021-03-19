import { DeckElement } from '../../types';

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
