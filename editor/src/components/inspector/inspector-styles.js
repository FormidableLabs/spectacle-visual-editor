import styled from 'styled-components';
import { defaultTheme } from 'evergreen-ui';

export const InspectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 300px;
  background: ${defaultTheme.scales.neutral.N4};
  border-left: ${defaultTheme.scales.neutral.N6} 1px solid;
`;

export const Pane = styled.div`
  flex: 1;
  z-index: 1;
  padding: 10px;
  overflow-y: scroll;
`;
