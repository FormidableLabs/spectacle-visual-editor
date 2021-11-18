import React from 'react';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import { useSelector } from 'react-redux';
import { useEditElement } from '../../../hooks/use-edit-element';
import { selectedElementSelector } from '../../../slices/deck-slice';

const MdEditor = styled(AceEditor)`
  min-width: 500px;
`;

export const MarkdownEditor = () => {
  const handleElementChanged = useEditElement();
  const selectedElement = useSelector(selectedElementSelector);

  return (
    <MdEditor
      mode="markdown"
      theme="textmate"
      value={String(selectedElement?.children)}
      onChange={(val) => handleElementChanged({ children: val })}
      width="auto"
      height="150px"
      showGutter={false}
      focus
    />
  );
};
