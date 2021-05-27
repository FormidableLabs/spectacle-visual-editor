import { DeckElement, DeckSlide } from './deck-elements';
import { SpectacleTheme } from './theme';

export interface Deck {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  slides: DeckSlide[];
  elements: DeckElement[];
  theme: SpectacleTheme;
}
