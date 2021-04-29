import { ConstructedDeckElement } from '../../types/deck-elements';

export interface ElementControlsProps {
  selectedElement: ConstructedDeckElement | null;
  editableElementChanged(element: Record<string, any>): void;
}
