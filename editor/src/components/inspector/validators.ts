import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';
import { DeckElement } from '../../types/deck-elements';

export const isValidCSSColor = (color: string) =>
  isValidColorName(color) || isValidHSL(color) || isValidRGB(color);

export const isBoxElement = (element: DeckElement | null) =>
  Boolean(element?.component?.includes('Box'));

export const isMdElement = (element: DeckElement | null) =>
  Boolean(element?.component?.includes('Markdown'));

export const isTextElement = (element: DeckElement | null) =>
  Boolean(element && ['Heading', 'Text'].includes(element?.component));
