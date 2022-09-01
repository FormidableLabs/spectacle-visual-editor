import styled from 'styled-components';
import { SlideScaleWrapper } from '../slide/slide';
import { defaultTheme } from 'evergreen-ui';

export const EditorBody = styled.div`
  background: ${defaultTheme.colors.gray300};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const EditorContent = styled.div`
  display: flex;
  flex: 1 1 0;
  overflow: auto;
  flex-direction: row;
`;

export const EditorCanvas = styled.div<{ scale: string }>`
  display: flex;
  flex: 1;
  align-items: ${(props) => (props.scale === 'fit' ? 'center' : 'flex-start')};
  justify-content: center;
  overflow: auto;

  ${SlideScaleWrapper} {
    box-shadow: ${defaultTheme.shadows[2]};
    overflow: auto;
  }
`;
