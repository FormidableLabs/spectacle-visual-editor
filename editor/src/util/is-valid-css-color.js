import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';

export const isValidCSSColor = (color) => {
  if (!color || typeof color !== 'string') {
    return false;
  }
  return isValidColorName(color) || isValidHSL(color) || isValidRGB(color);
};
