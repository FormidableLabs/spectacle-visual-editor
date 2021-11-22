import React, { useState } from 'react';
import { Positioner, SegmentedControl } from 'evergreen-ui';
import styled, { CSSObject } from 'styled-components';
import { MarkdownEditor } from './markdown-editor';
import { VisualEditor } from './visual-editor';

type EditorTypes = 'markdown' | 'visual';

const Toolbar = styled.div<{ css: CSSObject }>`
  ${({ css }) => css}
`;

/*
 * This component is used for inline rich text and markdown editing.
 */
export const InlineEditor: React.FC = () => {
  const [editorPreference, setEditorPreference] = useState<EditorTypes>(
    'visual'
  );

  return (
    <Positioner
      isShown
      position="bottom"
      target={({ getRef }) => (
        <div ref={getRef}>
          {editorPreference === 'markdown' ? (
            <MarkdownEditor />
          ) : (
            <VisualEditor />
          )}
        </div>
      )}
    >
      {({ css, getRef, state, style }) => (
        <Toolbar style={style} data-state={state} css={css} ref={getRef as any}>
          <SegmentedControl
            options={[
              { label: 'Visual', value: 'visual' },
              { label: 'Markdown', value: 'markdown' }
            ]}
            value={editorPreference}
            onChange={(value) => setEditorPreference(value as EditorTypes)}
            width="150px"
            backgroundColor="#d0dce8"
          />
        </Toolbar>
      )}
    </Positioner>
  );
};
