import { v4 } from 'uuid';
import { indentNormalizer } from 'spectacle';
import { DeckElement } from '../types/deck-elements';

export const basicLayout = (): DeckElement[] => [
  {
    component: 'Markdown',
    id: v4(),
    children: indentNormalizer(`
      # Second Slide

      This is a paragraph.
    `)
  }
];
