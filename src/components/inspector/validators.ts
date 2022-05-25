import { colord } from 'colord';
import {
  ConstructedDeckElement,
  CONTAINER_ELEMENTS
} from '../../types/deck-elements';

export const isValidCSSColor = (color: string) => colord(color).isValid();

export const isBoxElement = (element: ConstructedDeckElement | null) =>
  Boolean(
    element?.component?.includes('FlexBox') &&
      CONTAINER_ELEMENTS.includes(element?.component)
  );

export const isGridElement = (element: ConstructedDeckElement | null) =>
  Boolean(
    element?.component?.includes('Grid') &&
      CONTAINER_ELEMENTS.includes(element?.component)
  );

export const isMdElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('Markdown'));

export const isImageElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('Image'));

export const isTextElement = (element: ConstructedDeckElement | null) =>
  Boolean(
    element && ['Heading', 'Text', 'CodePane'].includes(element?.component)
  );

export const isProgressElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('Progress'));

export const isFullScreenElement = (element: ConstructedDeckElement | null) =>
  Boolean(element?.component?.includes('FullScreen'));
