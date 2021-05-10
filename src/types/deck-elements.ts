/**
 * Element in our deck component tree.
 * - Elements can be nested inside other elements (a la children)
 * - Element children are represented by their ids rather than their full entity
 * - Constructed versions replace the child id references with the full children entities to form a
 *   complete tree
 */
export type SPECTACLE_ELEMENTS =
  | 'Slide'
  | 'Markdown'
  | 'FlexBox'
  | 'Image'
  | 'Grid';
export const RESIZABLE_ELEMENTS: SPECTACLE_ELEMENTS[] = ['FlexBox', 'Image'];
export const CONTAINER_ELEMENTS: SPECTACLE_ELEMENTS[] = ['FlexBox', 'Grid'];

export type DeckElementMap = { [id: string]: DeckElement };

export type DeckElement = {
  component: SPECTACLE_ELEMENTS;
  id: string;
  props?: { [key: string]: any };
  children?: string | string[];
};

export type DeckSlide = Omit<DeckElement, 'component' | 'children'> & {
  component: 'Slide';
  children: string[];
};

export type ConstructedDeckElement = Omit<DeckElement, 'children'> & {
  children?: string | ConstructedDeckElement[];
};

export type ConstructedDeckSlide = Omit<DeckSlide, 'children'> & {
  children: ConstructedDeckElement[];
};
