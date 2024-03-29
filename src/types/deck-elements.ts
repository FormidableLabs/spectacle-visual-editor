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
  | 'Grid'
  | 'Progress'
  | 'FullScreen'
  | 'Notes';

export const RESIZABLE_ELEMENTS: SPECTACLE_ELEMENTS[] = [
  'FlexBox',
  'Image',
  'Markdown'
];
export const CONTAINER_ELEMENTS: SPECTACLE_ELEMENTS[] = ['FlexBox', 'Grid'];
// To check whether a constructed element is allowed to have child elements
export const ALL_CONTAINER_ELEMENTS: SPECTACLE_ELEMENTS[] = [
  ...CONTAINER_ELEMENTS,
  'Slide'
];
export const FREE_MOVING_ELEMENTS: SPECTACLE_ELEMENTS[] = [
  'Markdown',
  'FlexBox',
  'Image',
  'Grid',
  'Progress',
  'FullScreen'
];

export const SELF_RESIZING_ELEMENTS: SPECTACLE_ELEMENTS[] = ['Markdown'];

export type DeckElementMap = { [id: string]: DeckElement };

export type DeckElement = {
  component: SPECTACLE_ELEMENTS;
  id: string;
  props?: { [key: string]: any };
  children?: string | string[];
  parent: string;
};

export type DeckSlide = Omit<
  DeckElement,
  'component' | 'children' | 'parent'
> & {
  component: 'Slide';
  children: string[];
};

export type ConstructedDeckElement = Omit<
  DeckElement,
  'children' | 'parent'
> & {
  children?: string | ConstructedDeckElement[];
  parent?: string;
};

export type ConstructedDeckSlide = Omit<DeckSlide, 'children'> & {
  children: ConstructedDeckElement[];
};

export type DeckSlideTemplate = DeckSlide;

export type ConstructedDeckSlideTemplate = Omit<
  DeckSlideTemplate,
  'component' | 'children'
> & {
  component: 'div';
};
