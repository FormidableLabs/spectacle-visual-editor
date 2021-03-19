import { DeckElement } from '../../../types';

export const ELEMENTS: { [key: string]: Partial<DeckElement> } = {
  HEADING: {
    component: 'Markdown',
    children: '# Oh Hello There'
  },
  BOX: {
    component: 'Box',
    props: { backgroundColor: 'limegreen', height: 100, width: 200 },
    children: []
  }
};

export const CONTAINER_ELEMENTS = ['Box', 'FlexBox'];
