import styled from 'styled-components';
import { defaultTheme } from 'evergreen-ui';
import { padding, PaddingProps } from 'styled-system';

export const InspectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${defaultTheme.scales.neutral.N4};
  overflow: hidden;
  height: 100%;
`;

export const Pane = styled.div<PaddingProps>`
  flex: 1;
  z-index: 1;
  ${padding}
`;
