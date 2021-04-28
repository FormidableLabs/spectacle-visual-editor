import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';
import { CONTAINER_ELEMENTS, DeckElement } from '../../types/deck-elements';

export const isValidCSSColor = (color: string) =>
  isValidColorName(color) || isValidHSL(color) || isValidRGB(color);

export const isBoxElement = (element: DeckElement | null) =>
  Boolean(element && CONTAINER_ELEMENTS.includes(element?.component));

export const isMdElement = (element: DeckElement | null) =>
  Boolean(element?.component?.includes('Markdown'));

export const isImageElement = (element: DeckElement | null) =>
  Boolean(element?.component?.includes('Image'));

export const isTextElement = (element: DeckElement | null) =>
  Boolean(element && ['Heading', 'Text'].includes(element?.component));
