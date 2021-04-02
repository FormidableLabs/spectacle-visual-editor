import { v4 } from 'uuid';
import { DeckElement } from '../types/deck-elements';

export const basicLayout = (): DeckElement[] => [
  {
    component: 'Markdown',
    id: v4(),
    children: '# Second Slide'
  }
];
