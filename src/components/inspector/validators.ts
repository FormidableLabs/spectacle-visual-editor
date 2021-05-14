import { colord } from 'colord';
import {
  ConstructedDeckElement,
  CONTAINER_ELEMENTS
} from '../../types/deck-elements';

export const isValidCSSColor = (color: string) => colord(color).isValid();

export const isBoxElement = (element: ConstructedDeckElement | null) =>
  Boolean(element && CONTAINER_ELEMENTS.includes(element?.component));

export const isMdElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('Markdown'));

export const isImageElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('Image'));

export const isTextElement = (element: ConstructedDeckElement | null) =>
  Boolean(element && ['Heading', 'Text'].includes(element?.component));

export const isCodePaneElement = (element: ConstructedDeckElement | null) =>
  Boolean(element && ['CodePane'].includes(element?.component));
