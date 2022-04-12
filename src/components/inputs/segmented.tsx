import * as React from 'react';
import { Button, FormField, Group } from 'evergreen-ui';

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
      <Group display="flex">
        {options.map((op) => (
          <Button
            key={op}
            isActive={value === op}
            onClick={() => onChange(op)}
            flex={1}
          >
            {/* Capitalize first letter of option */}
            {op.trim().replace(/^\w/, (c) => c.toUpperCase())}
          </Button>
        ))}
      </Group>
    </FormField>
  );
};
