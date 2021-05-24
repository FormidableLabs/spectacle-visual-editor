import styled from 'styled-components';
import { SlideScaleWrapper } from '../slide/slide';
import { defaultTheme } from 'evergreen-ui';

export const EditorBody = styled.div`
  background: ${defaultTheme.scales.neutral.N5};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const EditorContent = styled.div`
  display: flex;
  flex-direction: row;
  overflow: auto;
`;

export const EditorCanvas = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  overflow: auto;

  ${SlideScaleWrapper} {
    box-shadow: 1px 2px 5px ${defaultTheme.scales.neutral.N8A};
  }
`;
