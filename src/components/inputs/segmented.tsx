import * as React from 'react';
import { FormField, SegmentedControl } from 'evergreen-ui';

interface Props {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string | number | boolean) => void;
}

export const SegmentedInput: React.FC<Props> = ({
  label,
  options,
  value,
  onChange
}) => {
  return (
    <FormField label={label} marginBottom={24}>
      <SegmentedControl
        value={value}
        options={options.map((op) => ({
          // Capitalize first letter of option
          label: op.trim().replace(/^\w/, (c) => c.toUpperCase()),
          value: op
        }))}
        onChange={(value) => onChange(value)}
      />
    </FormField>
  );
};
