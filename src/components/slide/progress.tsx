import React, { forwardRef } from 'react';
import { Progress } from 'spectacle';
import styled from 'styled-components';
import { position } from 'styled-system';
import { useLocation } from '@reach/router';
import { PATHS } from '../../constants/paths';

const InternalProgress = forwardRef<
  HTMLDivElement,
  { size: number; color: string }
>(function InternalProgressWithRef({ size, color, ...props }, ref) {
  const location = useLocation();
  const isPreview = location.pathname === PATHS.PREVIEW_DECK;

  return (
    <Container isPreview={isPreview} ref={ref} {...props}>
      <Progress size={size} color={color} />
    </Container>
  );
});

const Container = styled.div<{ isPreview: boolean }>`
  ${position}

  ${({ isPreview }) =>
    !isPreview &&
    `
      * {
        pointer-events: none;
      }
  `}
`;

export default InternalProgress;
