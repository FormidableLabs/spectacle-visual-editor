import React, { forwardRef } from 'react';
import { FullScreen } from 'spectacle';
import styled from 'styled-components';
import { position } from 'styled-system';
import { useLocation } from '@reach/router';
import { PATHS } from '../../constants/paths';

const InternalFullScreen = forwardRef<
  HTMLDivElement,
  { size: number; color: string }
>(function InternalFullScreenWithRef({ size, color, ...props }, ref) {
  const location = useLocation();
  const isPreview = location.pathname === PATHS.PREVIEW_DECK;

  return (
    <Container isPreview={isPreview} ref={ref} {...props}>
      <FullScreen size={size} color={color} />
    </Container>
  );
});

const Container = styled.div<{ isPreview: boolean }>`
  ${position}

  ${({ isPreview }) =>
    !isPreview &&
    `
      * {
        pointer-events: none !important;
      }
  `}
`;

export default InternalFullScreen;
