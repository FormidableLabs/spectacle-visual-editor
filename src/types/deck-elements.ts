/**
 * Element in our deck component tree.
 * - Elements can be nested inside other elements (a la children)
 */
export type DeckElement = {
  component: 'Slide' | 'Markdown' | 'Box' | 'Image' | 'FlexBox';
  id: string;
  props?: { [key: string]: any };
  children?: string | DeckElement[];
};

export type DeckSlide = DeckElement & {
  component: 'Slide';
  children: DeckElement[];
};


export type DeckElement2 = {
  component: 'Slide' | 'Markdown' | 'Box' | 'Image' | 'FlexBox';
  id: string;
  props?: { [key: string]: any };
  children?: string | string[];
};

export type ConstructedDeckElement2 = DeckElement2 & {
  children?: string | ConstructedDeckElement2[];
};

export type DeckElementMap2 = Record<string, DeckElement2>;

export type DeckSlide2 = DeckElement2 & {
  component: 'Slide';
  children: string[];
};

export type ConstructedDeckSlide2 = ConstructedDeckElement2 & DeckSlide2 & {
  children: ConstructedDeckElement2[];
}
