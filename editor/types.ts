/**
 * Element in our deck component tree.
 * - Elements can be nested inside other elements (a la children)
 */
export type DeckElement = {
  component: 'Slide' | 'Markdown' | 'Box';
  id: string;
  props?: { [key: string]: any };
  children: string | DeckElement[];
};

export type DeckSlide = DeckElement & {
  component: 'Slide';
  children: DeckElement[];
};

export type DeckTree = DeckElement[];
