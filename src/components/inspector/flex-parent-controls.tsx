import React, { useCallback } from 'react';
import { ElementControlsProps } from './element-controls-props';
import {
  ALIGN_ITEMS,
  ALIGN_ITEMS_OPTIONS,
  FLEX_DIRECTION,
  FLEX_DIRECTION_OPTIONS,
  JUSTIFY_CONTENT,
  JUSTIFY_CONTENT_OPTIONS
} from '../../constants/flex-parent-options';
import { SegmentedInput } from '../inputs/segmented';
import { SelectInput } from '../inputs/select';

export const FlexParentControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const flexDirectionValue =
    selectedElement?.props?.flexDirection || FLEX_DIRECTION.column;
  const justifyContentValue =
    selectedElement?.props?.justifyContent || JUSTIFY_CONTENT.CENTER;
  const alignItemsValue =
    selectedElement?.props?.justifyContent || ALIGN_ITEMS.CENTER;

  const convertOptionsToObjects = (options: any) => {
    return Object.values(options).map((op: any) => ({
      value: op,
      // Capitalize first letter of option
      title: op.trim().replace(/^\w/, (c: string) => c.toUpperCase())
    }));
  };

  const handleValueChanged = useCallback(
    (propName: string, value) => editableElementChanged({ [propName]: value }),
    [editableElementChanged]
  );

  return (
    <>
      <SegmentedInput
        label="Layout Content"
        options={Object.values(FLEX_DIRECTION_OPTIONS)}
        value={flexDirectionValue}
        onChange={(value) => handleValueChanged('flexDirection', value)}
      />
      <SelectInput
        label="Justify Content"
        value={justifyContentValue}
        options={convertOptionsToObjects(JUSTIFY_CONTENT_OPTIONS)}
        onValueChange={(value) => handleValueChanged('justifyContent', value)}
      />
      <SelectInput
        label="Align Items"
        value={alignItemsValue}
        options={convertOptionsToObjects(ALIGN_ITEMS_OPTIONS)}
        onValueChange={(value) => handleValueChanged('alignItems', value)}
      />
    </>
  );
};
