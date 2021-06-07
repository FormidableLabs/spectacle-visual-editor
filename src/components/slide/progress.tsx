import React, { FC } from 'react';
import { Progress } from 'spectacle';
import styled from 'styled-components';
import { position } from 'styled-system';
import { useLocation } from '@reach/router';
import { PATHS } from '../../constants/paths';

const InternalProgress: FC<{ size: number; color: string }> = ({
  size,
  color,
  ...props
}) => {
  const location = useLocation();
  const isPreview = location.pathname === PATHS.PREVIEW_DECK;

  return (
    <Container isPreview={isPreview} {...props}>
      <Progress size={size} color={color} />
    </Container>
  );
};

const Container = styled.div<{ isPreview: boolean }>`
  ${position}
`;

// const Container = styled.div<{ isPreview: boolean }>`
//   ${position}

//   ${({ isPreview }) =>
//     !isPreview &&
//     `
//       * {
//         pointer-events: none;
//       }
//   `}
// `;

export default InternalProgress;
