import * as React from 'react';
import { SelectField } from 'evergreen-ui';

interface Props {
  label: string;
  options: { value: string; title: string }[];
  value: string;
  onValueChange: (val: string) => void;
}

export const SelectInput: React.FC<Props> = ({
  label,
  options,
  value,
  onValueChange
}) => {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option disabled value="">
        -- select an option --
      </option>
      {options.map((op) => (
        <option value={op.value} key={op.value}>
          {op.title}
        </option>
      ))}
    </SelectField>
  );
};
