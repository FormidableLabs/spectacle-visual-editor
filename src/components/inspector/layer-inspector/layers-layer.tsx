import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import {
  selectedElementSelector,
  hoveredEditableElementIdSelector
} from '../../../slices/deck-slice';

import {
  ConstructedDeckElement,
  CONTAINER_ELEMENTS
} from '../../../types/deck-elements';
import { Layer, LayerDragWrapper } from '../../helpers/layer-drag-wrapper';
import { ElementCard } from './layers-element-card';

interface Props {
  element: ConstructedDeckElement;
  index: number;
  parentId?: string;
  onDrag: (dragLayer: Layer, hoverLayer: Layer) => void;
  onDrop: (
    previousParent: string | undefined,
    nextParent: string | undefined
  ) => void;
  onDragInside: (
    dragLayer: Layer,
    hoverLayer: Layer,
    fromDirection: 'top' | 'bottom'
  ) => void;
  onDragOutside: (dragLayer: Layer, hoverLayer: Layer) => void;
  onClick: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (e: MouseEvent<HTMLDivElement>) => void;
  handleExpand: (id: string) => void;
  getIsExpanded: (id: string) => boolean;
}

export const InpectorLayer: React.FC<Props> = ({
  element,
  index,
  parentId,
  onDrag,
  onDrop,
  onDragInside,
  onDragOutside,
  onClick,
  onMouseEnter,
  onMouseLeave,
  handleExpand,
  getIsExpanded
}) => {
  const selectedElement = useSelector(selectedElementSelector);
  const hoveredElementId = useSelector(hoveredEditableElementIdSelector);
  const isExpanded = getIsExpanded(element.id);
  return (
    <>
      <LayerDragWrapper
        id={element.id}
        index={index}
        parentId={parentId}
        isContainerElement={CONTAINER_ELEMENTS.includes(element.component)}
        onDrag={onDrag}
        onDrop={onDrop}
        onDragInside={onDragInside}
        onDragOutside={onDragOutside}
      >
        <ElementCard
          element={element}
          isHovered={element.id === hoveredElementId}
          isSelected={element.id === selectedElement?.id}
          isChildElement={Boolean(parentId)}
          isParentSelected={parentId === selectedElement?.id}
          isExpanded={isExpanded}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          handleExpand={handleExpand}
        />
        {isExpanded &&
          Array.isArray(element.children) &&
          element.children.map((childElement, childElementIndex) => (
            <InpectorLayer
              key={childElement.id}
              element={childElement}
              index={childElementIndex}
              parentId={element.id}
              getIsExpanded={getIsExpanded}
              handleExpand={handleExpand}
              onClick={onClick}
              onDrag={onDrag}
              onDrop={onDrop}
              onDragInside={onDragInside}
              onDragOutside={onDragOutside}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          ))}
      </LayerDragWrapper>
    </>
  );
};
