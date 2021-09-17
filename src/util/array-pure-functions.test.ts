import { moveArrayItem } from './array-pure-function';

describe('moveArrayItem', () => {
  it('should not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    moveArrayItem(arr, 0, 1);
    expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('should move an item in an array', () => {
    const arr = [1, 2, 3, 4, 5];
    const newArr = moveArrayItem(arr, 0, 1);
    expect(newArr).toStrictEqual([2, 1, 3, 4, 5]);
  });

  it('should return clone of original array if either index out of bounds', () => {
    const arr = [1, 2, 3, 4, 5];

    expect(moveArrayItem(arr, 3, 10)).toStrictEqual(arr);
    expect(moveArrayItem(arr, 6, 10)).toStrictEqual(arr);
  });
});
