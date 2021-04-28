/**
 * Element in our deck component tree.
 * - Elements can be nested inside other elements (a la children)
 * - Element children are represented by their ids rather than their full entity
 * - Constructed versions replace the child id references with the full children entities to form a
 *   complete tree
 */
export type DeckElementMap = { [id: string]: DeckElement };

export type DeckElement = {
  component: 'Slide' | 'Markdown' | 'Box' | 'Image' | 'FlexBox';
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
}
