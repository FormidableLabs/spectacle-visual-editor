import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';

export const isValidCSSColor = (color) =>
  isValidColorName(color) || isValidHSL(color) || isValidRGB(color);
