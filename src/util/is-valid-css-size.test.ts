import { isValidCSSSize } from './is-valid-css-size';

describe('is-valid-css-size', () => {
  test('validates a pixel size', () => {
    expect(isValidCSSSize('12px')).toBeTruthy();
  });

  test('validates an em size', () => {
    expect(isValidCSSSize('200em')).toBeTruthy();
  });

  test('validates a number', () => {
    expect(isValidCSSSize(0)).toBeTruthy();
  });

  test('validates the number 0', () => {
    expect(isValidCSSSize(0)).toBeTruthy();
  });

  test('validates a percent size', () => {
    expect(isValidCSSSize('30%')).toBeTruthy();
  });

  test('validates the string-based number 0', () => {
    expect(isValidCSSSize('0')).toBeTruthy();
  });

  test('invalidates bad input', () => {
    expect(isValidCSSSize('10carlos')).toBeFalsy();
  });

  test('invalidates the number 12', () => {
    expect(isValidCSSSize(12)).toBeFalsy();
  });
});
