import { v4 } from 'uuid';
import { DeckElement, DeckSlide } from './types/deck-elements';

const childId1 = v4();
const childId2 = v4();
const childId3 = v4();
const childId4 = v4();
const childId5 = v4();
const childId6 = v4();
const childId7 = v4();

export const sampleSlidesData: DeckSlide[] = [
  {
    component: 'Slide',
    id: v4(),
    children: [childId1]
  },
  {
    component: 'Slide',
    id: v4(),
    children: [childId4, childId5]
  },
  {
    component: 'Slide',
    id: v4(),
    children: [childId6]
  },
  {
    component: 'Slide',
    id: v4(),
    children: [childId7]
  }
];

export const sampleElementsData: DeckElement[] = [
  {
    component: 'FlexBox',
    id: childId1,
    props: {
      height: '100%',
      flexDirection: 'column',
      backgroundColor: '#2a3668',
      borderColor: '#ffffff',
      componentProps: {}
    },
    children: [childId2, childId3],
    parent: sampleSlidesData[0].id
  },
  {
    component: 'Markdown',
    id: childId2,
    props: {
      componentProps: {
        margin: '10px'
      }
    },
    children: '## Spectacle',
    parent: childId1
  },
  {
    component: 'Markdown',
    id: childId4,
    children: '# Second Slide',
    parent: sampleSlidesData[1].id
  },
  {
    component: 'Markdown',
    id: childId5,
    children: '- one\n- two\n- three',
    parent: sampleSlidesData[1].id
  },
  {
    component: 'Markdown',
    id: childId6,
    children: '# Third Slide',
    parent: sampleSlidesData[2].id
  },
  {
    component: 'Markdown',
    id: childId7,
    children: '# Fourth Slide',
    parent: sampleSlidesData[3].id
  }
];
