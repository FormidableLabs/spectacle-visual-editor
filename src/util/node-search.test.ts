import {
  deleteInTreeForNode,
  searchTreeForNode,
  copyNode
} from './node-search';
import { DeckElement } from '../types/deck-elements';
describe('searchForTree', () => {
  const tree: DeckElement[] = [
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

describe('deleteInTreeForNode', () => {
  const tree: DeckElement[] = [
    {
      component: 'Slide',
      id: '123',
      props: {
        color: 'red'
      },
      children: [
        {
          component: 'FlexBox',
          id: '456',
          props: {
            color: 'yellow'
          },
          children: [
            {
              component: 'Image',
              id: '555',
              props: {
                color: 'blue'
              }
            }
          ]
        }
      ]
    }
  ];

  test('should do nothing if object does not exist in tree', () => {
    const treeCopy = [...tree];
    deleteInTreeForNode(tree, '999');
    expect(treeCopy).toEqual(tree);
  });

  test('should delete nested object in tree', () => {
    deleteInTreeForNode(tree, '555');
    expect(tree[0].children).toEqual([
      {
        component: 'FlexBox',
        id: '456',
        props: { color: 'yellow' },
        children: []
      }
    ]);
  });
});

describe('copyNode', () => {
  const tree: DeckElement = {
    component: 'Slide',
    id: '123',
    props: {
      color: 'red'
    },
    children: [
      {
        component: 'FlexBox',
        id: '456',
        props: {
          color: 'yellow'
        },
        children: [
          {
            component: 'Image',
            id: '555',
            props: {
              color: 'blue'
            }
          }
        ]
      }
    ]
  };

  test('should not mutate original tree', () => {
    copyNode(tree);
    expect(tree).toEqual({
      component: 'Slide',
      id: '123',
      props: {
        color: 'red'
      },
      children: [
        {
          component: 'FlexBox',
          id: '456',
          props: {
            color: 'yellow'
          },
          children: [
            {
              component: 'Image',
              id: '555',
              props: {
                color: 'blue'
              }
            }
          ]
        }
      ]
    });
  });

  test('should set ids to null for all nodes in tree', () => {
    const nodesWithoutIds = copyNode(tree);
    expect(nodesWithoutIds).toEqual({
      component: 'Slide',
      id: null,
      props: {
        color: 'red'
      },
      children: [
        {
          component: 'FlexBox',
          id: null,
          props: {
            color: 'yellow'
          },
          children: [
            {
              component: 'Image',
              id: null,
              props: {
                color: 'blue'
              }
            }
          ]
        }
      ]
    });
  });
});
