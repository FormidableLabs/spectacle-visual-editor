import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  EditorCommand
} from 'draft-js';
import { Map } from 'immutable';
import { Heading, Quote, Text } from 'spectacle';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { IconButton, Positioner, defaultTheme, Tooltip } from 'evergreen-ui';
import styled from 'styled-components';
import { useEditElement } from '../../../hooks/use-edit-element';
import { selectedElementSelector } from '../../../slices/deck-slice';
import {
  BLOCK_TYPES,
  INLINE_STYLE_TYPES,
  HEADING_TYPES,
  HEADING_OPTIONS,
  INLINE_STYLE_OPTIONS,
  BLOCK_OPTIONS,
  TEXT_ALIGN_TYPES,
  TEXT_ALIGN_OPTIONS,
  MD_COMPONENT_PROPS
} from '../../../constants/md-style-options';

import 'draft-js/dist/Draft.css';

const Toolbar = styled.div<{ css: string }>`
  display: flex;
  background-color: #fff;
  padding: 4px;
  border-radius: 3px;
  ${({ css }) => css}
`;

const ToolbarSection = styled.div`
  display: flex;
  & + & {
    margin-left: 4px;
    padding-left: 4px;
    border-left: 1px solid ${defaultTheme.scales.neutral.N4A};
  }
`;

const StyledIconButton = styled(IconButton)`
  background-color: ${(props) =>
    props.isSelected ? '#d0dce8' : '#fff'} !important;
  }
`;

export const VisualEditor = () => {
  const selectedElement = useSelector(selectedElementSelector);

  /* Setup editor with markdown from store */
  const content = convertFromRaw(
    markdownToDraft(String(selectedElement?.children))
  );
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(content)
  );

  /* Sync editor content with markdown in store */
  const editorContent = editorState.getCurrentContent();
  const handleElementChanged = useEditElement();
  useEffect(() => {
    const markdown = draftToMarkdown(convertToRaw(editorContent));
    handleElementChanged({ children: markdown });
  }, [editorContent, handleElementChanged]);

  /* Map markdown elements to spectacle components */
  const selectedElementComponentProps =
    selectedElement?.props?.componentProps || {};
  const componentProps = {
    children: null, // Required prop, gets overwritten by Draft.js
    ...selectedElementComponentProps
  };
  const componentMapper = Map({
    'header-one': {
      element: 'div',
      wrapper: <Heading fontSize="h1" {...componentProps} />
    },
    'header-two': {
      element: 'div',
      wrapper: <Heading fontSize="h2" {...componentProps} />
    },
    'header-three': {
      element: 'div',
      wrapper: <Heading fontSize="h3" {...componentProps} />
    },
    blockquote: {
      element: 'div',
      wrapper: <Quote {...componentProps} />
    },
    unstyled: {
      element: 'div',
      wrapper: <Text {...componentProps} />
    }
  });

  /* Function that applies inline styles to the current selection */
  const applyFormattingOption = (
    type: 'inlineStyle' | 'block' | 'textAlign',
    value: HEADING_TYPES | INLINE_STYLE_TYPES | BLOCK_TYPES | TEXT_ALIGN_TYPES
  ) => (e: React.MouseEvent) => {
    e.preventDefault();

    /* Restore focus on selected text */
    const editorStateFocused = EditorState.forceSelection(
      editorState,
      editorState.getSelection()
    );

    if (type === 'inlineStyle') {
      setEditorState(RichUtils.toggleInlineStyle(editorStateFocused, value));
    }

    if (type === 'block') {
      setEditorState(RichUtils.toggleBlockType(editorStateFocused, value));
    }

    if (type === 'textAlign') {
      handleElementChanged({
        componentProps: {
          ...selectedElementComponentProps,
          [MD_COMPONENT_PROPS.TEXT_ALIGN]: value
        }
      });
      setEditorState(editorStateFocused);
    }
  };

  /* Function that manages keyboard shortcuts i.e. cmd+b to bold text */
  const handleKeyCommand = (command: EditorCommand) => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);

    if (newEditorState) {
      setEditorState(newEditorState);
      return 'handled';
    }

    return 'not-handled';
  };

  const textAlignment =
    selectedElementComponentProps?.textAlign ?? TEXT_ALIGN_TYPES.LEFT;

  return (
    <Positioner
      isShown
      position="top"
      targetOffset={30}
      target={({ getRef }) => (
        <div ref={getRef}>
          <Editor
            editorState={editorState}
            blockRenderMap={componentMapper}
            textAlignment={textAlignment}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      )}
    >
      {({ css, getRef, state, style }) => (
        <Toolbar
          style={style}
          data-state={state}
          css={(css as unknown) as string}
          ref={getRef as any}
        >
          <ToolbarSection>
            {Object.keys(HEADING_OPTIONS).map((key) => {
              const option = HEADING_OPTIONS[key as HEADING_TYPES];
              const isSelected =
                editorState
                  .getCurrentContent()
                  .getBlockForKey(editorState.getSelection().getStartKey())
                  .getType() === key;
              return (
                <Tooltip key={`visual-editor-${key}`} content={option.tooltip}>
                  <StyledIconButton
                    icon={option.icon}
                    onClick={applyFormattingOption(
                      'block',
                      key as HEADING_TYPES
                    )}
                    appearance="minimal"
                    isSelected={isSelected}
                  />
                </Tooltip>
              );
            })}
          </ToolbarSection>

          <ToolbarSection>
            {Object.keys(INLINE_STYLE_OPTIONS).map((key) => {
              const option = INLINE_STYLE_OPTIONS[key as INLINE_STYLE_TYPES];
              const isSelected = editorState.getCurrentInlineStyle().has(key);
              return (
                <Tooltip key={`visual-editor-${key}`} content={option.tooltip}>
                  <StyledIconButton
                    key={`visual-editor-${key}`}
                    icon={option.icon}
                    onClick={applyFormattingOption(
                      'inlineStyle',
                      key as INLINE_STYLE_TYPES
                    )}
                    appearance="minimal"
                    isSelected={isSelected}
                  />
                </Tooltip>
              );
            })}
          </ToolbarSection>

          <ToolbarSection>
            {Object.keys(BLOCK_OPTIONS).map((key) => {
              const option = BLOCK_OPTIONS[key as BLOCK_TYPES];
              const isSelected =
                editorState
                  .getCurrentContent()
                  .getBlockForKey(editorState.getSelection().getStartKey())
                  .getType() === key;
              return (
                <Tooltip key={`visual-editor-${key}`} content={option.tooltip}>
                  <StyledIconButton
                    key={`visual-editor-${key}`}
                    icon={option.icon}
                    onClick={applyFormattingOption('block', key as BLOCK_TYPES)}
                    appearance="minimal"
                    isSelected={isSelected}
                  />
                </Tooltip>
              );
            })}
          </ToolbarSection>

          <ToolbarSection>
            {Object.keys(TEXT_ALIGN_OPTIONS).map((key) => {
              const option = TEXT_ALIGN_OPTIONS[key as TEXT_ALIGN_TYPES];
              const isSelected = textAlignment === key;
              return (
                <Tooltip key={`visual-editor-${key}`} content={option.tooltip}>
                  <StyledIconButton
                    key={`visual-editor-${key}`}
                    icon={option.icon}
                    onClick={applyFormattingOption(
                      'textAlign',
                      key as TEXT_ALIGN_TYPES
                    )}
                    appearance="minimal"
                    isSelected={isSelected}
                  />
                </Tooltip>
              );
            })}
          </ToolbarSection>
        </Toolbar>
      )}
    </Positioner>
  );
};
