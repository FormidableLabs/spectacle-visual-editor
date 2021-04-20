import { v4 } from 'uuid';
import { DeckSlide } from './types/deck-elements';

export const sampleSlideData: DeckSlide[] = [
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
            component: 'Box',
            id: v4(),
            props: {
              backgroundColor: 'yellowgreen',
              width: 100,
              height: 100
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
