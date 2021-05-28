export const moveArrayItemToAnotherArray = <T>(
  array1: T[],
  array2: T[],
  itemIndex: number,
  destinationIndex: number
) => {
  const clonedArray1 = [...array1];
  const clonedArray2 = [...array2];

  if (itemIndex >= array1.length || destinationIndex >= array2.length + 1) {
    return [clonedArray1, clonedArray2];
  }

  const movingItem = array1[itemIndex];

  clonedArray1.splice(itemIndex, 1);
  clonedArray2.splice(destinationIndex, 0, movingItem);

  return [clonedArray1, clonedArray2];
};
