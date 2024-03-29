/**
 * User Interface Components
 */

export { AppBodyStyle } from './user-interface/app-styles';
export { MenuBar } from './user-interface/menu-bar';
export {
  EditorBody,
  EditorContent,
  EditorCanvas
} from './user-interface/editor-styles';
export { SpectacleLogo } from './user-interface/logo';

/**
 * Slide and Spectacle Components
 */
export { Slide } from './slide/slide';
export { SlideTimeline } from './slide/slide-timeline';
export { SlideViewer } from './slide/slide-viewer/slide-viewer';
export { ELEMENTS } from './slide/elements';
export { PreviewDeck } from './slide/preview-deck';
export {
  generateInternalEditableSlideTree,
  generateInternalSlideTree,
  generatePreviewSlideTree,
  generateSlideTreeFromMap
} from './slide/slide-generator';

/**
 * Inspector Components
 */
export { Inspector } from './inspector';
export { Accordion } from './user-interface/accordion';

/**
 * Input Components
 */
export { ColorPickerInput } from './inputs/color';

/**
 * Resizable Panes
 */
export { ResizablePanes } from './resizable-panes';

/**
 * Saved Decks
 */
export { SavedDecks } from './saved-decks';

/**
 * Component Adapter for React.FC components for use in React 18
 */
export { Tooltip, DndProvider } from './component-adapter';
