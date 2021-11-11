import React, { useState } from 'react';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import { useEditElement } from '../../hooks/use-edit-element';
import { selectedElementSelector } from '../../slices/deck-slice';
import { useSelector } from 'react-redux';
import { SegmentedControl } from 'evergreen-ui';

const MdEditor = styled(AceEditor)`
  min-width: 500px;
`;

type EditorTypes = 'markdown' | 'visual';

/*
 * This component is used for inline editing, it only supports MD content right now
 */
export const InlineEditor: React.FC = () => {
  const selectedElement = useSelector(selectedElementSelector);
  const handleElementChanged = useEditElement();
  const [editorPreference, setEditorPreference] = useState<EditorTypes>(
    'visual'
  );

  return (
    <>
      <SegmentedControl
        options={[
          { label: 'Visual', value: 'visual' },
          { label: 'Markdown', value: 'markdown' }
        ]}
        value={editorPreference}
        onChange={(value) => {
          setEditorPreference(value as EditorTypes);
        }}
        marginBottom="10px"
        width="150px"
        backgroundColor="#d0dce8"
      />
      {editorPreference === 'markdown' ? (
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
      ) : (
        // TODO: Replace this with visual editor code
        selectedElement?.children
      )}
    </>
  );
};
