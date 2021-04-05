import { DeckElement } from '../types/deck-elements';

export const isDeckElement = (element: any): element is DeckElement =>
  typeof element?.component === 'string' && typeof element?.id === 'string';

export const isDeckElementChildren = (
  element: any
): element is DeckElement['children'] =>
  typeof element === 'string' ||
  (Array.isArray(element) && element.every((c) => isDeckElement(c)));
