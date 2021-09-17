export const moveArrayItem = <T>(
  items: T[],
  itemIndex: number,
  destinationIndex: number
) => {
  const clonedItems = [...items];

  if (itemIndex >= items.length || destinationIndex >= items.length) {
    return clonedItems;
  }

  const movingItem = items[itemIndex];

  clonedItems.splice(itemIndex, 1);
  clonedItems.splice(destinationIndex, 0, movingItem);

  return clonedItems;
};

export const removeArrayItem = <T>(items: T[], itemIndex: number) => {
  const clonedItems = [...items];

  if (itemIndex >= items.length) {
    return clonedItems;
  }

  return [...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)];
};
