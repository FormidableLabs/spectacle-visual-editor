import { DeckElement } from '../../types/deck-elements';

export const ELEMENTS: Record<string, Omit<DeckElement, 'id'>> = {
  HEADING: {
    component: 'Markdown',
    children: '# Oh Hello There'
  },
  TEXT: {
    component: 'Markdown',
    children: 'I am text'
  },
  LIST: {
    component: 'Markdown',
    children: `- one\n- two\n- three`
  },
  BOX: {
    component: 'Box',
    props: { backgroundColor: 'limegreen', height: 100, width: 200 },
    children: []
  },
  IMAGE: {
    component: 'Image',
    props: {
      src: 'https://source.unsplash.com/WLUHO9A_xik/1600x900',
      width: '500px',
      height: `${(9 / 16) * 500}px`
    }
  }
};

export const CONTAINER_ELEMENTS = ['Box', 'FlexBox'];
