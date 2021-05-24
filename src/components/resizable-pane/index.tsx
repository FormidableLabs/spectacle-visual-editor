export { default as ResizablePane } from './pane';
export { default as ResizablePaneSplitter } from './splitter';
export { default as ResizablePaneContainer } from './container';

export type Orientation = 'horizontal' | 'vertical';
export interface Flex {
  [index: string]: number;
}
export interface Pane {
  id: string;
  minSize?: number;
  maxSize?: number;
  initialSize?: number;
  initialFlex?: number;
}
