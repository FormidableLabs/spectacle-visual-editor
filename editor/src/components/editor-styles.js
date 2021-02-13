import styled from 'styled-components';
import { SlideScaleWrapper } from './slide';

export const EditorBody = styled.div`
  background: #f7f3f2;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const EditorContent = styled.div`
  flex: 1 0 auto;
`;

export const EditorCanvas = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  ${SlideScaleWrapper} {
    box-shadow: 1px 2px 5px hsla(0, 0%, 0%, 0.5);
  }
`;
