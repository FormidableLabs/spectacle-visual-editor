import { ConstructedDeckElement, DeckElement } from '../types/deck-elements';

export const constructDeckElements =
  (elementIds: string[], getElementById: (id: string) => DeckElement | undefined): ConstructedDeckElement[] => {
    return elementIds.map((elementId) => {
      const element = getElementById(elementId);

      if (!element) {
        return;
      }

      if (element.children && Array.isArray(element.children)) {
        return { ...element, children: constructDeckElements(element.children, getElementById) }
      }

      return element as ConstructedDeckElement;
    }).filter((element): element is ConstructedDeckElement => !!element);
  };
