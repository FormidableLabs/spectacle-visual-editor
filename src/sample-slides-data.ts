import { v4 } from 'uuid';
import { DeckElementMap, DeckSlide } from './types/deck-elements';

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

export const sampleElementsData: DeckElementMap = {
  [childId1]: {
    component: 'FlexBox',
    id: childId1,
    props: {
      height: '100%',
      flexDirection: 'column'
    },
    children: [childId2, childId3]
  },
  [childId2]: {
    component: 'Markdown',
    id: childId2,
    props: {
      componentProps: {
        margin: 10
      }
    },
    children: '## Spectacle'
  },
  [childId3]: {
    component: 'FlexBox',
    id: childId3,
    props: {
      backgroundColor: 'yellowgreen',
      width: 200,
      height: 100,
      flexDirection: 'column'
    }
  },
  [childId4]: {
    component: 'Markdown',
    id: childId4,
    children: '# Second Slide'
  },
  [childId5]: {
    component: 'Markdown',
    id: childId5,
    children: '- one\n- two\n- three'
  },
  [childId6]: {
    component: 'Markdown',
    id: childId6,
    children: '# Third Slide'
  },
  [childId7]: {
    component: 'Markdown',
    id: childId7,
    children: '# Fourth Slide'
  }
};
