import React from 'react';
import { IconButton, IconComponent } from 'evergreen-ui';
import { Tooltip } from '../../../component-adapter';

interface Props {
  tooltip: string;
  icon?: React.ReactElement | IconComponent;
  onClick: () => void;
  isSelected: boolean;
}

export const ToolbarButton = ({
  tooltip,
  icon,
  onClick,
  isSelected
}: Props) => {
  return (
    <Tooltip content={tooltip}>
      <IconButton
        icon={icon}
        onClick={onClick}
        appearance="minimal"
        isActive={isSelected}
      />
    </Tooltip>
  );
};
