import { v4 } from 'uuid';
import { indentNormalizer } from 'spectacle';
import { DeckElement } from '../types/deck-elements';

export const basicLayout = (): DeckElement[] => [
  {
    component: 'Markdown',
    id: v4(),
    children: indentNormalizer(`
      # Header

      This is a paragraph.
    `)
  }
];

export const codePaneLayout = (): DeckElement[] => [
  {
    component: 'Markdown',
    id: v4(),
    children: indentNormalizer(`
      # Header

      \`\`\`jsx
      export function Counter() {
        const [counter, setCounter] = useState(0);
        return (
          <div onClick={() => setCounter(counter + 1)}>
            {counter}
          </div>
        );
      }
      \`\`\`
    `)
  }
];
