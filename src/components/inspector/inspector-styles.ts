import styled from 'styled-components';
import { defaultTheme } from 'evergreen-ui';
import { padding, PaddingProps } from 'styled-system';

export const InspectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 300px;
  background: ${defaultTheme.scales.neutral.N4};
  border-left: ${defaultTheme.scales.neutral.N6} 1px solid;
  overflow: hidden;
`;

export const Pane = styled.div<PaddingProps>`
  flex: 1;
  z-index: 1;
  overflow-y: scroll;
  ${padding}
`;
