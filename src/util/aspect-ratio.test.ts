import { calculateAspectRatio } from './aspect-ratio';

describe('calculateAspectRatio', () => {
  it('should recalculate aspect ratio for height', () => {
    const result = calculateAspectRatio(2 / 1, 'width', 50);
    const expected = { width: 50, height: 25 };
    expect(result).toEqual(expected);
  });
  it('should recalculate aspect width', () => {
    const result = calculateAspectRatio(2 / 1, 'height', 25);
    const expected = { width: 50, height: 25 };
    expect(result).toEqual(expected);
  });
});
