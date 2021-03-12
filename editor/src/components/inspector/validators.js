import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';

export const isValidCSSColor = (color) =>
  isValidColorName(color) || isValidHSL(color) || isValidRGB(color);

export const isBoxElement = (element) =>
  Boolean(element?.component?.includes('Box'));

export const isTextElement = (element) =>
  Boolean(['Heading', 'Text'].includes(element?.component));
