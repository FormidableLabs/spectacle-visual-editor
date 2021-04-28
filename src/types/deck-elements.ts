/**
 * Element in our deck component tree.
 * - Elements can be nested inside other elements (a la children)
 */
export type DeckElement = {
  component: 'Slide' | 'Markdown' | 'Box' | 'Image' | 'FlexBox';
  id: string;
  props?: { [key: string]: any };
  children?: string | string[];
};

export type ConstructedDeckElement = DeckElement & {
  children?: string | ConstructedDeckElement[];
};

export type DeckElementIds = string[];
export type DeckElementMap = { [id: string]: DeckElement };

export type DeckSlide = DeckElement & {
  component: 'Slide';
  children: string[];
};

export type ConstructedDeckSlide = ConstructedDeckElement & DeckSlide & {
  children: ConstructedDeckElement[];
}
