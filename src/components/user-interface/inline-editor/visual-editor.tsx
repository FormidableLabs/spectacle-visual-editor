import React, { useMemo, createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { EditorState, LexicalEditor } from 'lexical';
import LexicalComposer from '@lexical/react/LexicalComposer';
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
import ContentEditable from '@lexical/react/LexicalContentEditable';
import ListPlugin from '@lexical/react/LexicalListPlugin';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import LexicalMarkdownShortcutPlugin from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown';
import { Positioner } from 'evergreen-ui';
import { useEditElement } from '../../../hooks/use-edit-element';
import { selectedElementSelector } from '../../../slices/deck-slice';
import {
  LexicalThemeWrapper,
  ToolbarPlugin,
  StylePlugin
} from './visual-editor-components';

interface IVisualEditorContext {
  selectedElementComponentProps: any;
  handleElementChanged: (
    sender: any
  ) => {
    payload: {
      [key: string]: any;
    } & {
      children?: string | undefined;
    };
    type: string;
  };
}

const VisualEditorContext = createContext<IVisualEditorContext>({
  selectedElementComponentProps: {},
  handleElementChanged: () => ({ payload: {}, type: '' })
});

export const useVisualEditorContext = () => useContext(VisualEditorContext);

export const VisualEditor = () => {
  const selectedElement = useSelector(selectedElementSelector);
  const selectedElementComponentProps = useMemo(
    () => selectedElement?.props?.componentProps || {},
    [selectedElement?.props?.componentProps]
  );

  const initialEditorState = () => {
    $convertFromMarkdownString(String(selectedElement?.children), TRANSFORMERS);
  };

  const handleElementChanged = useEditElement();

  const onEditorChange = (state: EditorState, editor: LexicalEditor) => {
    editor.update(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      handleElementChanged({ children: markdown });
    });
  };

  return (
    <VisualEditorContext.Provider
      value={{ selectedElementComponentProps, handleElementChanged }}
    >
      <LexicalThemeWrapper>
        {(theme) =>
          !!theme && (
            <LexicalComposer
              initialConfig={{
                theme,
                onError(error: Error) {
                  throw error;
                },
                nodes: [
                  HeadingNode,
                  ListNode,
                  ListItemNode,
                  QuoteNode,
                  CodeNode,
                  CodeHighlightNode
                ]
              }}
            >
              <Positioner
                isShown
                position="top"
                targetOffset={30}
                target={({ getRef }) => (
                  <div ref={getRef}>
                    <RichTextPlugin
                      initialEditorState={initialEditorState}
                      contentEditable={
                        <ContentEditable className="editor-input" />
                      }
                      placeholder={null}
                    />
                    <ListPlugin />
                    <StylePlugin />
                    <LexicalOnChangePlugin onChange={onEditorChange} />
                    <LexicalMarkdownShortcutPlugin
                      transformers={TRANSFORMERS}
                    />
                  </div>
                )}
              >
                {({ css, getRef, state, style }) => (
                  <ToolbarPlugin
                    style={style}
                    data-state={state}
                    css={css}
                    ref={getRef}
                  />
                )}
              </Positioner>
            </LexicalComposer>
          )
        }
      </LexicalThemeWrapper>
    </VisualEditorContext.Provider>
  );
};
