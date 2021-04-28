/**
 * Element in our deck component tree.
 * - Elements can be nested inside other elements (a la children)
 */

export type SPECTACLE_ELEMENTS = 'Slide' | 'Markdown' | 'FlexBox' | 'Image';
export const RESIZABLE_ELEMENTS: SPECTACLE_ELEMENTS[] = ['FlexBox', 'Image'];
export const CONTAINER_ELEMENTS: SPECTACLE_ELEMENTS[] = ['FlexBox'];

export type DeckElement = {
  component: SPECTACLE_ELEMENTS;
  id: string;
  props?: { [key: string]: any };
  children?: string | DeckElement[];
};

export type CopiedDeckElement = Omit<DeckElement, 'id'> & { id: string | null };

export type DeckSlide = DeckElement & {
  component: 'Slide';
  id: string;
  children: DeckElement[];
};
