import React, { Suspense } from 'react';
import { FormField } from 'evergreen-ui';

const AceEditor = React.lazy(async () => {
  const reactAce = await import(
    /* webpackChunkName: "react-ace" */
    /* webpackMode: "lazy" */
    'react-ace'
  );
  await import(
    /* webpackChunkName: "ace-builds-md" */
    /* webpackMode: "lazy" */
    'ace-builds/src-noconflict/mode-markdown'
  );
  await import(
    /* webpackChunkName: "ace-builds-tm" */
    /* webpackMode: "lazy" */
    'ace-builds/src-noconflict/theme-textmate'
  );
  return reactAce;
});

interface Props {
  label: string;
  onValueChange(value: string): void;
  value: string;
}

export const MdInput: React.FC<Props> = ({ label, value, onValueChange }) => {
  return (
    <FormField label={label} marginBottom={24}>
      <Suspense fallback={<div>Loading ...</div>}>
        <AceEditor
          mode="markdown"
          theme="textmate"
          value={value}
          onChange={(val) => onValueChange(val)}
          width="auto"
          height="150px"
          showGutter={false}
        />
      </Suspense>
    </FormField>
  );
};
