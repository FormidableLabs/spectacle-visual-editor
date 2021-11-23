import React, { useState } from 'react';
import { Button, Group, Positioner } from 'evergreen-ui';
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
          <Group width={200}>
            <Button
              isActive={editorPreference === 'visual'}
              onClick={() => setEditorPreference('visual')}
              flex={1}
            >
              Visual
            </Button>
            <Button
              isActive={editorPreference === 'markdown'}
              onClick={() => setEditorPreference('markdown')}
              flex={1}
            >
              Markdown
            </Button>
          </Group>
        </Toolbar>
      )}
    </Positioner>
  );
};
