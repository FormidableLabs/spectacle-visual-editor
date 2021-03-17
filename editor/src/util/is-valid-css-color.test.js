import { isValidCSSColor } from './is-valid-css-color';

describe('isValidCSSColor', () => {
  test('is true for RGB color', () => {
    expect(isValidCSSColor('rgb(255, 255, 0)')).toBeTruthy();
  });

  test('is true for HSLA color', () => {
    expect(isValidCSSColor('hsla(0, 0%, 0%, 0.25)')).toBeTruthy();
  });

  test('is true for HEX color', () => {
    expect(isValidCSSColor('#123abc')).toBeTruthy();
  });

  test('is false for an invalid color', () => {
    expect(isValidCSSColor('milo')).toBeFalsy();
  });

  test('is false for undefined', () => {
    expect(isValidCSSColor()).toBeFalsy();
  });

  test('is false for not a string', () => {
    expect(isValidCSSColor([1])).toBeFalsy();
  });
});
