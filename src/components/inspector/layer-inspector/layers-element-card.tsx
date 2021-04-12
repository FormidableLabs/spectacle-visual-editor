import React from 'react';
import { DeckElement } from '../../../types/deck-elements';
import styled from 'styled-components';
import { defaultTheme } from 'evergreen-ui';
import { isImageElement, isMdElement } from '../validators';

/**
 * Layers tab element card
 * @param element DeckElement
 */
export const ElementCard: React.FC<{ element: DeckElement }> = ({
  element
}) => {
  const elementPreview = React.useMemo(() => {
    if (isMdElement(element)) {
      return String(element.children);
    } else if (isImageElement(element)) {
      return String(element?.props?.src);
    } else {
      return `${element.component} Element`;
    }
  }, [element]);

  return (
    <CardContainer>
      <TitleContainer>{element.component}</TitleContainer>
      <PreviewContainer>{elementPreview}</PreviewContainer>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  border: 1px solid ${defaultTheme.colors.border.default};
  box-shadow: ${defaultTheme.elevations[1]};
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
`;

const TitleContainer = styled.div`
  padding: 8px;
  background-color: white;
  font-weight: bold;
  color: ${defaultTheme.colors.text};
  border-bottom: 1px solid ${defaultTheme.colors.border.default};
`;

const PreviewContainer = styled.pre`
  padding: 8px;
  margin: 0;
  background-color: white;
  overflow-x: auto;
`;
