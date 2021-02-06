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
            component: 'Heading',
            id: v4(),
            props: {
              margin: 10,
              fontSize: 'h2'
            },
            children: [
              {
                component: 'div',
                id: v4(),
                children: 'Spectacle'
              }
            ]
          },
          {
            component: 'SpectacleLogo',
            id: v4(),
            props: {
              size: 400
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
        component: 'Heading',
        id: v4(),
        children: 'Second Slide'
      }
    ]
  },
  {
    component: 'Slide',
    id: v4(),
    children: [
      {
        component: 'Heading',
        id: v4(),
        children: 'Third Slide'
      }
    ]
  },
  {
    component: 'Slide',
    id: v4(),
    children: [
      {
        component: 'Heading',
        id: v4(),
        children: 'Fourth Slide'
      }
    ]
  }
];
