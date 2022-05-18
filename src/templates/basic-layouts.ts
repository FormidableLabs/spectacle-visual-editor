import { v4 } from 'uuid';
import { indentNormalizer } from 'spectacle';
import { DeckElementMap } from '../types/deck-elements';

export const ROOT_ELEMENT = '<ROOT>';
export const basicLayout = (): {
  elementIds: string[];
  elementMap: DeckElementMap;
} => {
  const elementId1 = v4();
  const elementId2 = v4();

  return {
    elementIds: [elementId1, elementId2],
    elementMap: {
      [elementId1]: {
        component: 'Markdown',
        id: elementId1,
        props: {
          componentProps: {
            textAlign: 'center'
          }
        },
        parent: ROOT_ELEMENT,
        children: indentNormalizer(`
          # Header
        `)
      },
      [elementId2]: {
        component: 'Markdown',
        id: elementId2,
        props: {
          componentProps: {}
        },
        parent: ROOT_ELEMENT,
        children: indentNormalizer(`
          This is a paragraph.
        `)
      }
    }
  };
};

export const codePaneLayout = (): {
  elementIds: string[];
  elementMap: DeckElementMap;
} => {
  const elementId1 = v4();
  const elementId2 = v4();

  return {
    elementIds: [elementId1, elementId2],
    elementMap: {
      [elementId1]: {
        component: 'Markdown',
        id: elementId1,
        props: {
          componentProps: {
            textAlign: 'center'
          }
        },
        parent: ROOT_ELEMENT,
        children: indentNormalizer(`
          # Header
        `)
      },
      [elementId2]: {
        component: 'Markdown',
        id: elementId2,
        props: {
          componentProps: {}
        },
        parent: ROOT_ELEMENT,
        children: indentNormalizer(`
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
