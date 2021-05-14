import React from 'react';
import { FormField } from 'evergreen-ui';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-textmate';

interface Props {
  label: string;
  onValueChange(value: string): void;
  value: string;
}

export const MdInput: React.FC<Props> = ({ label, value, onValueChange }) => {
  return (
    <FormField label={label}>
      <AceEditor
        mode="markdown"
        theme="textmate"
        value={value}
        onChange={(val) => onValueChange(val)}
        width="auto"
        height="150px"
        showGutter={false}
      />
    </FormField>
  );
};
