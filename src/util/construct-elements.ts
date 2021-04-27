import { ConstructedDeckElement2, DeckElement2 } from '../types/deck-elements';

export const constructElements =
  (elementIds: string[], getElementById: (id: string) => DeckElement2 | undefined): ConstructedDeckElement2[] => {
    return elementIds.map((elementId) => {
      const element = getElementById(elementId);

      if (!element) {
        return;
      }

      if (element.children && Array.isArray(element.children)) {
        return { ...element, children: constructElements(element.children, getElementById) }
      }

      return element as ConstructedDeckElement2;
    }).filter((element): element is ConstructedDeckElement2 => !!element);
  };
