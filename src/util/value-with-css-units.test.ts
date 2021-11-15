import { valueWithCSSUnits } from './value-with-css-units';

describe('value-with-css-units', () => {
  test('returns `undefined` for "0" to prevent overriding defaults', () => {
    expect(valueWithCSSUnits('0')).toBeUndefined();
  });

  test('returns the value unmodified if supported css unit type is provided', () => {
    expect(valueWithCSSUnits('815px')).toBe('815px');
    expect(valueWithCSSUnits('95%')).toBe('95%');
    expect(valueWithCSSUnits('3vh')).toBe('3vh');
    expect(valueWithCSSUnits('30em')).toBe('30em');
    expect(valueWithCSSUnits('100vw')).toBe('100vw');
  });

  test('returns the value with any whitespace between value and unit trimmed', () => {
    expect(valueWithCSSUnits('815 px')).toBe('815px');
  });

  test('returns the value and adds "px" if value is parseable as a number and no unit is provided', () => {
    expect(valueWithCSSUnits('38')).toBe('38px');
  });

  test('returns the value and adds "px" if value is parseable as a number and no *valid* unit is provided', () => {
    expect(valueWithCSSUnits('38p')).toBe('38px');
    expect(valueWithCSSUnits('100v')).toBe('100px');
    expect(valueWithCSSUnits('1064foobarr')).toBe('1064px');
  });
});
