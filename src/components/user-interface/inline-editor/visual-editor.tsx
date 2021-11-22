import React, { Children, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  EditorCommand,
  DefaultDraftBlockRenderMap
} from 'draft-js';
import { Map } from 'immutable';
import {
  Heading,
  ListItem,
  OrderedList,
  UnorderedList,
  Quote,
  Text
} from 'spectacle';
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
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

/* Additional markdown config for draftjs-md-converter */
const extraMarkdownDictionary = {
  STRIKETHROUGH: '~~',
  CODE: '`'
};
const extraMarkdownStyles = {
  inlineStyles: {
    Delete: {
      type: 'STRIKETHROUGH',
      symbol: '~~'
    },
    Code: {
      type: 'CODE',
      symbol: '`'
    }
  }
};

/* Wrapper for spectacle UnorderedList and OrderedList - renders children as ListItem components */
const ListWrapper = ({
  component: Component,
  children,
  ...props
}: {
  component: React.ComponentType<any>;
  children: React.ReactElement[];
}) => (
  <Component {...props}>
    {Children.map(children, (child: React.ReactElement) => {
      const childProps = { ...child.props };
      delete childProps.className; // Remove Draft.js default styling
      return <ListItem key={child.key} {...childProps} />;
    })}
  </Component>
);

export const VisualEditor = () => {
  const selectedElement = useSelector(selectedElementSelector);

  /* Setup editor with markdown from store */
  const content = convertFromRaw(
    mdToDraftjs(String(selectedElement?.children), extraMarkdownStyles)
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(content)
  );

  /* Sync editor content with markdown in store */
  const editorContent = editorState.getCurrentContent();
  const handleElementChanged = useEditElement();
  useEffect(() => {
    const markdown = draftjsToMd(
      convertToRaw(editorContent),
      extraMarkdownDictionary
    );
    handleElementChanged({ children: markdown });
  }, [editorContent, handleElementChanged]);

  /* Map markdown elements to spectacle components */
  const selectedElementComponentProps =
    selectedElement?.props?.componentProps || {};

  const componentProps = {
    children: null, // Required prop, gets overwritten by Draft.js
    ...selectedElementComponentProps
  };
  const blockRenderMap = Map({
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
    'ordered-list-item': {
      element: 'li',
      wrapper: <ListWrapper component={OrderedList} {...componentProps} />
    },
    'unordered-list-item': {
      element: 'li',
      wrapper: <ListWrapper component={UnorderedList} {...componentProps} />
    },
    unstyled: {
      element: 'div',
      wrapper: <Text {...componentProps} />,
      aliasedElements: ['p']
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
    } else if (type === 'block') {
      setEditorState(RichUtils.toggleBlockType(editorStateFocused, value));
    } else if (type === 'textAlign') {
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
            textAlignment={textAlignment}
            blockRenderMap={DefaultDraftBlockRenderMap.merge(blockRenderMap)}
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
