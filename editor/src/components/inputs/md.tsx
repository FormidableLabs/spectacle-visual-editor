import React, { ChangeEvent } from 'react';
import { TextareaField } from 'evergreen-ui';

interface Props {
  label: string;
  onValueChange(value: string): void;
  value: string;
}

export const MdInput: React.FC<Props> = ({ label, value, onValueChange }) => {
  return (
    <TextareaField
      label={label}
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        onValueChange(e.target.value)
      }
      autoFocus
    />
  );
};
