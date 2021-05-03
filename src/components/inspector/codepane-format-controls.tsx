import React, { useCallback } from 'react';
import { MdInput } from '../inputs/md';
import { ElementControlsProps } from './element-controls-props';
import { SelectInput } from '../inputs/select';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const availableLanguages = SyntaxHighlighter.supportedLanguages.map(
  (language: string) => ({ title: language, value: language })
);
export const CodePaneFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const language = selectedElement?.props?.language || 'typescript';

  const handleValueChanged = useCallback(
    (value) => editableElementChanged({ language: value }),
    [editableElementChanged]
  );

  return (
    <React.Fragment>
      <MdInput
        label="Content"
        value={String(selectedElement?.children)}
        onValueChange={(val) => editableElementChanged({ children: val })}
      />
      <SelectInput
        label="Language"
        options={availableLanguages}
        value={language}
        onValueChange={handleValueChanged}
      />
    </React.Fragment>
  );
};
