import { swapArrayItems } from './swap-array-items';

describe('swapArrayItems', () => {
  it('should not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    swapArrayItems(arr, 0, 1);
    expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('should swap items in an array', () => {
    const arr = [1, 2, 3, 4, 5];
    const newArr = swapArrayItems(arr, 0, 1);
    expect(newArr).toStrictEqual([2, 1, 3, 4, 5]);
  });

  it('should return clone of original array if either index out of bounds', () => {
    const arr = [1, 2, 3, 4, 5];

    expect(swapArrayItems(arr, 3, 10)).toStrictEqual(arr);
    expect(swapArrayItems(arr, 6, 10)).toStrictEqual(arr);
  });
});
