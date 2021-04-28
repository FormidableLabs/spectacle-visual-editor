import React, { useEffect, useCallback, useState } from 'react';
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
  // defaulting to column for now due to that being the current default behavior
  const [flexDirection, setFlexDirection] = useState(FLEX_DIRECTION.column);

  useEffect(() => {
    const selectedFlexDirection = selectedElement?.props?.flexDirection;
    console.log(selectedElement);
    setFlexDirection(selectedFlexDirection);
  }, [flexDirection, selectedElement]);

  const handleValueChanged = useCallback(
    (value) => editableElementChanged({ flexDirection: value }),
    [editableElementChanged]
  );

  return (
    <SelectInput
      label="Layout Content"
      onValueChange={handleValueChanged}
      value={flexDirection}
      options={selectableFlexOptions}
    />
  );
};
