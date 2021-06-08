import React, { useCallback } from 'react';
import { MdInput } from '../inputs/md';
import { ElementControlsProps } from './element-controls-props';
import { SelectInput } from '../inputs/select';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { FreeMovementControls } from './free-movement-controls';
import { ResizeControls } from './resize-controls';

const availableLanguages = (SyntaxHighlighter as any).supportedLanguages.map(
  (language: string) => ({
    title: language,
    value: language
  })
);

export const CodePaneFormatControls: React.FC<ElementControlsProps> = ({
  selectedElement,
  editableElementChanged
}) => {
  const language = selectedElement?.props?.language || 'javascript';
  const content = String(selectedElement?.children) || '';

  const handleValueChanged = useCallback(
    (value) => editableElementChanged({ language: value }),
    [editableElementChanged]
  );

  const handleInputChanged = useCallback(
    (value) => {
      editableElementChanged({ children: value });
    },
    [editableElementChanged]
  );

  return (
    <React.Fragment>
      <FreeMovementControls {...{ selectedElement, editableElementChanged }} />
      <ResizeControls {...{ selectedElement, editableElementChanged }} />
      <MdInput
        label="Content"
        value={content}
        onValueChange={handleInputChanged}
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
