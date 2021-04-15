import React, { MouseEvent } from 'react';
import { DeckElement } from '../../../types/deck-elements';
import styled from 'styled-components';
import { defaultTheme } from 'evergreen-ui';
import { isImageElement, isMdElement } from '../validators';

interface Props {
  element: DeckElement;
  onDownClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onUpClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Layers tab element card
 * @param element DeckElement
 */
export const ElementCard: React.FC<Props> = ({
  element,
  onDownClick,
  onUpClick
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
      <CardContent>
        <TitleContainer>{element.component}</TitleContainer>
        <PreviewContainer>{elementPreview}</PreviewContainer>
      </CardContent>
      <ArrowsContainer>
        {onUpClick && <button onClick={onUpClick}>up</button>}
        {onDownClick && <button onClick={onDownClick}>down</button>}
      </ArrowsContainer>
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

const CardContent = styled.div`
`;

const ArrowsContainer = styled.div`
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
