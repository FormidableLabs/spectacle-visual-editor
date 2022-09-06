import { v4 } from 'uuid';
import { DeckSlide, DeckSlideTemplate } from './types/deck-elements';

export const sampleSlidesData: DeckSlide[] = [
  {
    component: 'Slide',
    id: v4(),
    children: []
  }
];

export const sampleSlideTemplateData: DeckSlideTemplate = {
  component: 'Slide',
  id: v4(),
  props: {},
  children: []
};
