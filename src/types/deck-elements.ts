/**
 * Element in our deck component tree.
 * - Elements can be nested inside other elements (a la children)
 */
export type DeckElement = {
  component: 'Slide' | 'Markdown' | 'Box' | 'Image';
  id: string;
  props?: { [key: string]: any };
  children?: string | DeckElement[];
  parentId?: string;
};

export type DeckSlide = DeckElement & {
  component: 'Slide';
  id: string;
  children: DeckElement[];
};
