import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';
import { ConstructedDeckElement } from '../../types/deck-elements';

export const isValidCSSColor = (color: string) =>
  isValidColorName(color) || isValidHSL(color) || isValidRGB(color);

export const isBoxElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('Box'));

export const isMdElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('Markdown'));

export const isImageElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('Image'));

export const isTextElement = (element: ConstructedDeckElement | null) =>
  Boolean(element && ['Heading', 'Text'].includes(element?.component));
