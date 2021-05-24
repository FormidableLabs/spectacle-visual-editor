import React, { FC, useContext } from 'react';
import { defaultTheme } from 'evergreen-ui';
import styled from 'styled-components';
import { Orientation } from './';
import ResizablePaneContext from './context';

const Splitter = styled.div<{ orientation: Orientation }>`
  position: relative;
  flex-shrink: 0;
  width: ${(props) => (props.orientation === 'horizontal' ? '1px' : '100%')};
  height: ${(props) => (props.orientation === 'horizontal' ? '100%' : '1px')};
  background: ${defaultTheme.scales.neutral.N6};
  cursor: ${(props) =>
    props.orientation === 'horizontal' ? 'col-resize' : 'row-resize'};

  &::after {
    content: '';
    position: absolute;
    z-index: 1000;
    width: ${(props) => (props.orientation === 'horizontal' ? '5px' : '100%')};
    height: ${(props) => (props.orientation === 'horizontal' ? '100%' : '5px')};
    background: ${defaultTheme.palette.blue.base};
    transform: ${(props) =>
      props.orientation === 'horizontal'
        ? 'translateX(-2px)'
        : 'translateY(-2px)'};
    opacity: 0;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const ResizablePaneSplitter: FC = () => {
  const { orientation, handleResizeStart } = useContext(ResizablePaneContext)!;

  return (
    <Splitter
      orientation={orientation}
      onMouseDown={handleResizeStart}
      data-splitter
    />
  );
};

export default ResizablePaneSplitter;
