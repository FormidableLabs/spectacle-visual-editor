import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { Pane } from './';
import ResizablePaneContext from './context';

const StyledResizablePane = styled.div`
  overflow: auto;
`;

const ResizablePane: FC<Omit<Pane, 'id'>> = ({
  children,
  maxSize,
  minSize = 0,
  initialSize,
  initialFlex
}) => {
  const [id] = useState(v4());
  const { flex, orientation, initPane } = useContext(ResizablePaneContext)!;

  useEffect(() => {
    initPane({ id, minSize, maxSize, initialSize, initialFlex });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useMemo(() => {
    const styles = { flex: flex[id] };

    if (orientation === 'horizontal') {
      return {
        ...styles,
        minWidth: minSize,
        maxWidth: maxSize
      };
    } else {
      return {
        ...styles,
        minHeight: minSize,
        maxHeight: maxSize
      };
    }
  }, [flex, id, minSize, maxSize, orientation]);

  return (
    <StyledResizablePane data-pane={id} style={style}>
      {children}
    </StyledResizablePane>
  );
};

export default ResizablePane;
