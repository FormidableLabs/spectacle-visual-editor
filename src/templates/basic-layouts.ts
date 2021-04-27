import { v4 } from 'uuid';
import { indentNormalizer } from 'spectacle';
import { DeckElementMap2 } from '../types/deck-elements';

export const basicLayout = (): { elementIds: string[]; elementMap: DeckElementMap2; } => {
  const elementId = v4();

  return {
    elementIds: [elementId],
    elementMap: {
      [elementId]: {
        component: 'Markdown',
        id: elementId,
        children: indentNormalizer(`
          # Header

          This is a paragraph.
        `)
      }
    }
  };
};

export const codePaneLayout = (): { elementIds: string[]; elementMap: DeckElementMap2; } => {
  const elementId = v4();

  return {
    elementIds: [elementId],
    elementMap: {
      [elementId]: {
        component: 'Markdown',
        id: elementId,
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
    }
  };
};
