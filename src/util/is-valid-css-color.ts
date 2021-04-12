import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';

export const isValidCSSColor = (color: string) => {
  if (!color) {
    return false;
  }

  return isValidColorName(color) || isValidHSL(color) || isValidRGB(color);
};
