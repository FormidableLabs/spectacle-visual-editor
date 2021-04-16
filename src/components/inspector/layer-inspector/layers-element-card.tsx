import React, { MouseEvent } from 'react';
import { DeckElement } from '../../../types/deck-elements';
import styled from 'styled-components';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Button,
  ButtonProps,
  defaultTheme
} from 'evergreen-ui';
import { isImageElement, isMdElement } from '../validators';

interface Props {
  isActive?: boolean;
  element: DeckElement;
  onMoveDownClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
  onMoveUpClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  showMoveDownButton?: boolean;
  showMoveUpButton?: boolean;
}

/**
 * Layers tab element card
 * @param element DeckElement
 */
export const ElementCard: React.FC<Props> = ({
  element,
  isActive,
  onMoveDownClick,
  onMouseDown,
  onMoveUpClick,
  showMoveDownButton,
  showMoveUpButton
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

  const moveButtonProps: ButtonProps = {
    appearance: 'minimal',
    paddingX: 6,
    paddingY: 2
  };

  return (
    <CardContainer isActive={isActive} onMouseDown={onMouseDown}>
      <CardContent>
        <TitleContainer>{element.component}</TitleContainer>
        <PreviewContainer>{elementPreview}</PreviewContainer>
      </CardContent>

      {(showMoveDownButton || showMoveUpButton) && (
        <MoveButtonsContainer>
          {showMoveUpButton && (
            <Button {...moveButtonProps} onClick={onMoveUpClick}>
              <ArrowUpIcon size={14} />
            </Button>
          )}
          {showMoveDownButton && (
            <Button {...moveButtonProps} onClick={onMoveDownClick}>
              <ArrowDownIcon size={14} />
            </Button>
          )}
        </MoveButtonsContainer>
      )}
    </CardContainer>
  );
};

const CardContainer = styled.div<{ isActive?: boolean }>`
  cursor: move;
  display: flex;
  background-color: ${(props) =>
    props.isActive ? defaultTheme.colors.background.blueTint : 'white'};
  border: 1px solid;
  border-color: ${(props) =>
    props.isActive
      ? defaultTheme.palette.blue.base
      : defaultTheme.colors.border.default};
  border-radius: 5px;
  box-shadow: ${defaultTheme.elevations[1]};
  overflow: hidden;

  &:hover {
    background-color: ${defaultTheme.colors.background.blueTint};
  }
`;

const CardContent = styled.div`
  border-right: 1px solid ${defaultTheme.colors.border.default};
  flex: 1 0;
`;

const MoveButtonsContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TitleContainer = styled.div`
  border-bottom: 1px solid ${defaultTheme.colors.border.default};
  color: ${defaultTheme.colors.text};
  font-weight: bold;
  padding: 8px;
`;

const PreviewContainer = styled.pre`
  margin: 0;
  overflow-x: auto;
  padding: 8px;
`;
