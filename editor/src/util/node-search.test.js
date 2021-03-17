import { searchTreeForNode } from './node-search';

describe('searchForTree', () => {
  const tree = [
    {
      id: 123,
      color: 'red',
      children: [
        {
          id: 456,
          color: 'yellow'
        }
      ]
    }
  ];

  test('should find nested object in tree', () => {
    expect(searchTreeForNode(tree, 456)?.color).toBe('yellow');
  });

  test('should return null if object not in tree', () => {
    expect(searchTreeForNode(tree, 789)).toBeNull();
  });
});
