import React, { useCallback } from 'react';
import { SelectInput } from '../inputs/select';
import { ElementControlsProps } from './element-controls-props';
import {
  FLEX_DIRECTION,
  FLEX_DIRECTION_OPTIONS
} from '../../constants/flex-direction-options';

const selectableFlexOptions = FLEX_DIRECTION_OPTIONS.map((flexDir) => ({
  value: flexDir,
  title: flexDir
}));

export const FlexDirectionControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const value = selectedElement?.props?.flexDirection || FLEX_DIRECTION.column;

  const handleValueChanged = useCallback(
    (value) => editableElementChanged({ flexDirection: value }),
    [editableElementChanged]
  );

  return (
    <SelectInput
      label="Layout Content"
      onValueChange={handleValueChanged}
      value={value}
      options={selectableFlexOptions}
    />
  );
};
