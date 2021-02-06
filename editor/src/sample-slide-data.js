import { v4 } from 'uuid';

export const sampleSlideData = [
  {
    component: 'Slide',
    id: 'A',
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
  }
];
