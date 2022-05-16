import { DeckElement, DeckSlide, DeckSlideTemplate } from './deck-elements';
import { SpectacleTheme } from './theme';

// TODO: refine date types
export interface Deck {
  id: string;
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  slides: DeckSlide[];
  slideTemplate: DeckSlideTemplate;
  slideTemplateOpen: boolean;
  elements: DeckElement[];
  theme: SpectacleTheme;
}
