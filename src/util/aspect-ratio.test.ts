import { calculateAspectRatio } from './aspect-ratio';

describe('calculateAspectRatio', () => {
  it('should recalculate aspect ratio for height', () => {
    const result = calculateAspectRatio(
      { width: 100, height: 50 },
      { width: 50 }
    );
    const expected = { width: 50, height: 25 };
    expect(result).toEqual(expected);
  });
  it('should recalculate aspect width', () => {
    const result = calculateAspectRatio(
      { width: 100, height: 50 },
      { height: 25 }
    );
    const expected = { width: 50, height: 25 };
    expect(result).toEqual(expected);
  });
});
