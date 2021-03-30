import React, { ChangeEvent } from 'react';
import { TextareaField } from 'evergreen-ui';
import styled from 'styled-components';

interface Props {
  label: string;
  onValueChange(value: string): void;
  value: string;
}

export const MdInput: React.FC<Props> = ({ label, value, onValueChange }) => {
  return (
    <VerticallyResizableTextareaField
      label={label}
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        onValueChange(e.target.value)
      }
      autoFocus
    />
  );
};

const VerticallyResizableTextareaField = styled(TextareaField)`
  resize: vertical;
`;
