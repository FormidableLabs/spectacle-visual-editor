import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  CodeIcon,
  ColumnLayoutIcon,
  deprecatedDefaultTheme,
  Icon,
  IconButton,
  MediaIcon,
  NewGridItemIcon,
  AlignLeftIcon,
  PercentageIcon,
  FullscreenIcon,
  AnnotationIcon
} from 'evergreen-ui';
import { isImageElement, isMdElement } from '../validators';
import { ConstructedDeckElement } from '../../../types/deck-elements';

const ELEMENT_ICONS = {
  FlexBox: ColumnLayoutIcon,
  Markdown: AlignLeftIcon,
  Image: MediaIcon,
  Grid: NewGridItemIcon,
  CodePane: CodeIcon,
  Progress: PercentageIcon,
  FullScreen: FullscreenIcon,
  Notes: AnnotationIcon
};

interface Props {
  isHovered: boolean;
  isSelected: boolean;
  isParentSelected: boolean;
  isChildElement?: boolean;
  isExpanded?: boolean;
  element: ConstructedDeckElement;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (e: MouseEvent<HTMLDivElement>) => void;
  handleExpand?: () => void;
}

/**
 * Layers tab element card
 * @param element DeckElement
 */
export const ElementCard: React.FC<Props> = ({
  element,
  isHovered,
  isSelected,
  isParentSelected,
  isChildElement,
  isExpanded,
  onClick,
  onMouseEnter,
  onMouseLeave,
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
      isHovered={isHovered}
      isSelected={isSelected}
      isParentSelected={isParentSelected}
      isChildElement={isChildElement}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
  isHovered?: boolean;
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
      ? deprecatedDefaultTheme.scales.blue.B9
      : deprecatedDefaultTheme.scales.neutral.N9};
  background: ${(props) =>
    props.isSelected
      ? deprecatedDefaultTheme.scales.blue.B3A
      : props.isHovered
      ? deprecatedDefaultTheme.scales.neutral.N2A
      : props.isParentSelected
      ? deprecatedDefaultTheme.scales.blue.B1A
      : 'none'};

  &:focus {
    border: 1px solid ${deprecatedDefaultTheme.palette.blue.base};
  }
`;

const Title = styled.div`
  margin: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 1px;
`;
