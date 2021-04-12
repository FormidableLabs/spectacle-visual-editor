import { DeckElement } from '../../types/deck-elements';

export interface ElementControlsProps {
  selectedElement: DeckElement | null;
  editableElementChanged(element: Record<string, any>): void;
}
