import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  CodeIcon,
  ColumnLayoutIcon,
  Icon,
  IconButton,
  MediaIcon,
  NewGridItemIcon,
  AlignLeftIcon,
  PercentageIcon,
  FullscreenIcon,
  AnnotationIcon,
  defaultTheme
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

type Props = {
  element: ConstructedDeckElement;
  depth: number;
  isHovered: boolean;
  isSelected: boolean;
  isParentSelected: boolean;
  isChildElement?: boolean;
  isExpanded?: boolean;
  isDragging: boolean;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (e: MouseEvent<HTMLDivElement>) => void;
  handleExpand?: () => void;
};

export const ElementCard: React.FC<Props> = ({
  element,
  depth,
  isHovered,
  isSelected,
  isParentSelected,
  isChildElement,
  isExpanded,
  isDragging,
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
      isDragging={isDragging}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      depth={depth}
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

type DisplayProps = Omit<
  Props,
  | 'isHovered'
  | 'isChildElement'
  | 'isDragging'
  | 'onClick'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'handleExpand'
>;

export const ElementCardDisplay: React.FC<DisplayProps> = ({
  element,
  depth,
  isSelected,
  isParentSelected,
  isExpanded
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
      isSelected={isSelected}
      isParentSelected={isParentSelected}
      depth={depth}
      transparent
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
  isDragging?: boolean;
  transparent?: boolean;
  depth: number;
}>`
  cursor: grab;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 36px;
  padding-left: ${(props) => `${props.depth * 24 + 10}px`};
  padding-right: 10px;

  color: ${(props) =>
    props.isSelected || props.isParentSelected
      ? defaultTheme.colors.selected
      : defaultTheme.colors.default};
  background: ${(props) =>
    props.isSelected
      ? defaultTheme.colors.blue100
      : props.isHovered
      ? defaultTheme.colors.gray200
      : props.isParentSelected
      ? defaultTheme.colors.blue50
      : 'none'};

  opacity: ${(props) => (props.transparent ? 0.2 : 1)};
  max-height: ${(props) => (props.isDragging ? '0px' : 'none')}
  overflow: hidden;

  &:focus {
    border: 1px solid ${defaultTheme.colors.selected};
  }
`;

const Title = styled.div`
  margin: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 1px;
`;
