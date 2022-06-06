import React from 'react';
import { IconButton, Tooltip } from 'evergreen-ui';

interface Props {
  tooltip: string;
  icon?: React.ReactElement;
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
