import { ConstructedDeckElement } from '../types/deck-elements';

export const isDeckElement = (
  element: unknown
): element is ConstructedDeckElement =>
  typeof (<ConstructedDeckElement>element)?.component === 'string' &&
  typeof (<ConstructedDeckElement>element)?.id === 'string';

export const isDeckElementChildren = (
  element: unknown
): element is ConstructedDeckElement['children'] =>
  typeof element === 'string' ||
  (Array.isArray(element) && element.every((c) => isDeckElement(c)));
