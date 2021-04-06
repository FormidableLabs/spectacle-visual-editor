/**
 * Return a new array with two items in original array swapped.
 * @param items Array of items
 * @param idx1 Index of first item
 * @param idx2 Index of second item
 */
export const swapArrayItems = <T>(items: T[], idx1: number, idx2: number) => {
  const clonedItems = [...items];

  if (idx1 >= items.length || idx2 >= items.length) {
    return clonedItems;
  }

  const movingItem = items[idx1];

  clonedItems.splice(idx1, 1);
  clonedItems.splice(idx2, 0, movingItem);

  return clonedItems;
};
