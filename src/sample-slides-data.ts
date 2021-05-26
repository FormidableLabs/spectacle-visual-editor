import { v4 } from 'uuid';
import { DeckElementMap, DeckSlide } from './types/deck-elements';

const childId1 = v4();
const childId2 = v4();
const childId3 = v4();
const childId4 = v4();
const childId5 = v4();
const childId6 = v4();
const childId7 = v4();
const childId8 = v4();
const childId9 = v4();
const childId10 = v4();
const childId11 = v4();
const childId12 = v4();
const childId13 = v4();
const childId14 = v4();

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
  },
  {
    component: 'Slide',
    id: v4(),
    children: [childId14, childId8, childId11]
  }
];

export const sampleElementsData: DeckElementMap = {
  [childId1]: {
    component: 'FlexBox',
    id: childId1,
    props: {
      height: '100%',
      flexDirection: 'column',
      backgroundColor: '#2a3668'
    },
    children: [childId2, childId3],
    parent: sampleSlidesData[0].id
  },
  [childId2]: {
    component: 'Markdown',
    id: childId2,
    props: {
      componentProps: {
        margin: 10
      }
    },
    children: '## Spectacle',
    parent: childId1
  },
  [childId4]: {
    component: 'Markdown',
    id: childId4,
    children: '# Second Slide',
    parent: sampleSlidesData[1].id
  },
  [childId5]: {
    component: 'Markdown',
    id: childId5,
    children: '- one\n- two\n- three',
    parent: sampleSlidesData[1].id
  },
  [childId6]: {
    component: 'Markdown',
    id: childId6,
    children: '# Third Slide',
    parent: sampleSlidesData[2].id
  },
  [childId7]: {
    component: 'Markdown',
    id: childId7,
    children: '# Fourth Slide',
    parent: sampleSlidesData[3].id
  },
  [childId8]: {
    component: 'FlexBox',
    id: childId8,
    props: {
      height: '100%',
      flexDirection: 'column',
      backgroundColor: 'HotPink'
    },
    children: [childId9, childId10],
    parent: sampleSlidesData[4].id
  },
  [childId9]: {
    component: 'Markdown',
    id: childId9,
    children: 'Item 1',
    parent: childId8
  },
  [childId10]: {
    component: 'Markdown',
    id: childId10,
    children: 'Item 2',
    parent: childId8
  },
  [childId11]: {
    component: 'FlexBox',
    id: childId11,
    props: {
      height: '100%',
      flexDirection: 'column',
      backgroundColor: 'HotPink'
    },
    children: [childId12, childId13],
    parent: sampleSlidesData[4].id
  },
  [childId12]: {
    component: 'Markdown',
    id: childId12,
    children: 'Item 3',
    parent: childId11
  },
  [childId13]: {
    component: 'Markdown',
    id: childId13,
    children: 'Item 4',
    parent: childId11
  },
  [childId14]: {
    component: 'Markdown',
    id: childId14,
    children: '# Fifth Slide',
    parent: sampleSlidesData[4].id
  }
};
