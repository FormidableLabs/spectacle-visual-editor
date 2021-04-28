import { ConstructedDeckElement } from '../types/deck-elements';

export const isDeckElement = (
  element: any
): element is ConstructedDeckElement =>
  typeof element?.component === 'string' && typeof element?.id === 'string';

export const isDeckElementChildren = (
  element: any
): element is ConstructedDeckElement['children'] =>
  typeof element === 'string' ||
  (Array.isArray(element) && element.every((c) => isDeckElement(c)));
