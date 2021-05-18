import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  CodeIcon,
  ColumnLayoutIcon,
  defaultTheme,
  Icon,
  IconButton,
  MugshotIcon,
  NewGridItemIcon,
  TextHighlightIcon
} from 'evergreen-ui';
import { isImageElement, isMdElement } from '../validators';
import { ConstructedDeckElement } from '../../../types/deck-elements';

const ELEMENT_ICONS = {
  FlexBox: ColumnLayoutIcon,
  Markdown: TextHighlightIcon,
  Image: MugshotIcon,
  Grid: NewGridItemIcon,
  CodePane: CodeIcon
};

interface Props {
  isSelected?: boolean;
  isParentSelected?: boolean;
  isChildElement?: boolean;
  isExpanded?: boolean;
  element: ConstructedDeckElement;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  handleExpand?: () => void;
}

/**
 * Layers tab element card
 * @param element DeckElement
 */
export const ElementCard: React.FC<Props> = ({
  element,
  isSelected,
  isParentSelected,
  isChildElement,
  isExpanded,
  onClick,
  handleExpand
}) => {
  const hasChildren = Array.isArray(element.children);

  const elementTitle = React.useMemo(() => {
    if (isMdElement(element)) {
      return String(element.children);
    } else if (isImageElement(element)) {
      return String(element?.props?.src);
    } else {
      return element.component;
    }
  }, [element]);

  return (
    <Layer
      role="button"
      title={element.component}
      isSelected={isSelected}
      isParentSelected={isParentSelected}
      isChildElement={isChildElement}
      onClick={onClick}
    >
      <Icon
        icon={ELEMENT_ICONS[element.component as keyof typeof ELEMENT_ICONS]}
        size={14}
      />
      <Title>{elementTitle}</Title>

      {hasChildren && (
        <IconButton
          icon={isExpanded ? ChevronDownIcon : ChevronLeftIcon}
          height={24}
          appearance="minimal"
          marginLeft="auto"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (handleExpand) {
              handleExpand();
            }
          }}
        />
      )}
    </Layer>
  );
};

const Layer = styled.div<{
  isSelected?: boolean;
  isParentSelected?: boolean;
  isChildElement?: boolean;
}>`
  cursor: grab;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 36px;
  padding: 0 10px 0 ${(props) => (props.isChildElement ? '34px' : '10px')};
  color: ${(props) =>
    props.isSelected || props.isParentSelected
      ? defaultTheme.scales.blue.B9
      : defaultTheme.scales.neutral.N9};
  background: ${(props) =>
    props.isSelected
      ? defaultTheme.scales.blue.B3A
      : props.isParentSelected
      ? defaultTheme.scales.blue.B1A
      : 'none'};

  &:hover {
    background: ${(props) =>
      props.isSelected || props.isParentSelected
        ? defaultTheme.scales.blue.B3A
        : defaultTheme.scales.neutral.N2A};
  }

  &:focus {
    border: 1px solid ${defaultTheme.palette.blue.base};
  }
`;

const Title = styled.div`
  margin: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 1px;
`;
