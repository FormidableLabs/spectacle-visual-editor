import { moveArrayItemToAnotherArray } from './move-array-item-to-another-array';

describe('moveArrayItemToAnotherArray', () => {
  it('should not mutate original array', () => {
    const array1 = ['z', 'c', 'h'];
    const array2 = ['a', 'b', 'd'];
    moveArrayItemToAnotherArray(array1, array2, 0, 1);
    expect(array1).toStrictEqual(['z', 'c', 'h']);
    expect(array2).toStrictEqual(['a', 'b', 'd']);
  });

  it('should move an item in an array', () => {
    const array1 = ['z', 'c', 'h'];
    const array2 = ['a', 'b', 'd'];
    const [newArray1, newArray2] = moveArrayItemToAnotherArray(
      array1,
      array2,
      1,
      2
    );
    expect(newArray1).toStrictEqual(['z', 'h']);
    expect(newArray2).toStrictEqual(['a', 'b', 'c', 'd']);
  });

  it('should return clone of original array if either index out of bounds', () => {
    const array1 = ['z', 'c', 'h'];
    const array2 = ['a', 'b', 'd'];
    expect(moveArrayItemToAnotherArray(array1, array2, 1, 4)).toStrictEqual([
      array1,
      array2
    ]);
    expect(moveArrayItemToAnotherArray(array1, array2, 6, 10)).toStrictEqual([
      array1,
      array2
    ]);
  });
});
