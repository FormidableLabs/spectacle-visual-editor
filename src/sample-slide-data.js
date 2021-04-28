import { v4 } from 'uuid';

export const sampleSlideData = [
  {
    component: 'Slide',
    id: v4(),
    children: [
      {
        component: 'FlexBox',
        id: v4(),
        props: {
          height: '100%',
          flexDirection: 'column'
        },
        children: [
          {
            component: 'Markdown',
            id: v4(),
            props: {
              componentProps: {
                margin: 10
              }
            },
            children: '## Spectacle'
          },
          {
            component: 'FlexBox',
            id: v4(),
            props: {
              backgroundColor: 'yellowgreen',
              width: 200,
              height: 100,
              flexDirection: 'column'
            }
          }
        ]
      }
    ]
  },
  {
    component: 'Slide',
    id: v4(),
    children: [
      {
        component: 'Markdown',
        id: v4(),
        children: '# Second Slide'
      },
      {
        component: 'Markdown',
        id: v4(),
        children: '- one\n- two\n- three'
      }
    ]
  },
  {
    component: 'Slide',
    id: v4(),
    children: [
      {
        component: 'Markdown',
        id: v4(),
        children: '# Third Slide'
      }
    ]
  },
  {
    component: 'Slide',
    id: v4(),
    children: [
      {
        component: 'Markdown',
        id: v4(),
        children: '# Fourth Slide'
      }
    ]
  }
];
