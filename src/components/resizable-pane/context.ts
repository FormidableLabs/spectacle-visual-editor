import { createContext, MouseEventHandler } from 'react';
import { Pane, Flex, Orientation } from './';

export interface ResizablePaneContextProps {
  flex: Flex;
  orientation: Orientation;
  initPane: (pane: Pane) => void;
  handleResizeStart: MouseEventHandler<HTMLDivElement>;
}

const ResizablePaneContext = createContext<ResizablePaneContextProps | null>(
  null
);

export default ResizablePaneContext;
