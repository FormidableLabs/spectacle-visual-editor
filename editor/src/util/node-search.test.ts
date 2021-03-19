import { searchTreeForNode } from './node-search';
import { DeckTree } from '../../types';

describe('searchForTree', () => {
  const tree: DeckTree = [
    {
      component: 'Slide',
      id: '123',
      props: {
        color: 'red'
      },
      children: [
        {
          component: 'Markdown',
          id: '456',
          props: {
            color: 'yellow'
          },
          children: 'foobar'
        }
      ]
    }
  ];

  test('should find nested object in tree', () => {
    expect(searchTreeForNode(tree, '456')?.props?.color).toBe('yellow');
  });

  test('should return null if object not in tree', () => {
    expect(searchTreeForNode(tree, '789')).toBeNull();
  });
});
