export const searchTreeForNode = (tree, value) => {
  let foundNode = null;

  for (let leaf of tree) {
    if (leaf.id === value) {
      foundNode = leaf;
      break;
    }
  }

  if (foundNode === null) {
    for (let leaf of tree) {
      if (
        'children' in leaf &&
        Array.isArray(leaf.children) &&
        leaf.children.length > 0
      ) {
        foundNode = searchTreeForNode(leaf.children, value);
      }
    }
  }

  return foundNode;
};
