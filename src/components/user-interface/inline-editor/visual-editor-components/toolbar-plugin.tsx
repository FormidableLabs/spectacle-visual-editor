import React, { useCallback, useState } from 'react';
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $createParagraphNode,
  $isRangeSelection,
  RangeSelection
} from 'lexical';
import { $wrapLeafNodesInElements } from '@lexical/selection';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType
} from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { defaultTheme } from 'evergreen-ui';
import styled, { CSSObject } from 'styled-components';
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
} from '../../../../constants/md-style-options';
import { ToolbarState } from './toolbar-state';
import { ToolbarButton } from './toolbar-button';
import { useVisualEditorContext } from '../visual-editor';
import { useVisualEditorUpdate } from '../../../../hooks';

const Toolbar = styled.div<{ css: CSSObject }>`
  display: flex;
  background-color: #fff;
  padding: 4px;
  border-radius: 3px;
  ${({ css }) => css}
`;

const Divider = styled.div`
  border-left: 1px solid ${defaultTheme.colors.gray400};
  margin: 0px 4px;
`;

export const ToolbarPlugin = React.forwardRef<any, any>(function ToolbarPlugin(
  props,
  ref
) {
  const [editor] = useLexicalComposerContext();
  const {
    selectedElementComponentProps,
    handleElementChanged
  } = useVisualEditorContext();
  const [toolbarState, setToolbarState] = useState<ToolbarState>(
    new ToolbarState(editor, null)
  );

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const state = new ToolbarState(editor, selection as RangeSelection);
      setToolbarState(state);
    }
  }, [editor]);

  useVisualEditorUpdate(editor, updateToolbar);

  const formatBlock = useCallback(
    (blockType: 'paragraph' | HEADING_TYPES | BLOCK_TYPES) => {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => {
            if (toolbarState.blockType === blockType) {
              return $createParagraphNode();
            }
            switch (blockType) {
              case HEADING_TYPES.H1:
              case HEADING_TYPES.H2:
              case HEADING_TYPES.H3:
                return $createHeadingNode(blockType as HeadingTagType);
              case BLOCK_TYPES.QUOTE:
                return $createQuoteNode();
              case BLOCK_TYPES.CODE:
                return $createCodeNode();
              default:
                return $createParagraphNode();
            }
          });
        }
      });
    },
    [editor, toolbarState]
  );

  const formatList = useCallback(
    (blockType: BLOCK_TYPES) => {
      formatBlock('paragraph');
      if (toolbarState.blockType === blockType) {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, () => {});
      } else if (blockType === BLOCK_TYPES.UL) {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, () => {});
      } else if (blockType === BLOCK_TYPES.OL) {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, () => {});
      }
    },
    [editor, toolbarState, formatBlock]
  );

  const formatTextAlignment = useCallback(
    (value: TEXT_ALIGN_TYPES) => {
      handleElementChanged({
        componentProps: {
          ...selectedElementComponentProps,
          [MD_COMPONENT_PROPS.TEXT_ALIGN]: value
        }
      });

      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value);
    },
    [editor, selectedElementComponentProps, handleElementChanged]
  );

  return (
    <Toolbar ref={ref} {...props}>
      <ToolbarButton
        tooltip={HEADING_OPTIONS.h1.tooltip}
        icon={HEADING_OPTIONS.h1.icon}
        onClick={() => formatBlock(HEADING_TYPES.H1)}
        isSelected={toolbarState.blockType === HEADING_TYPES.H1}
      />

      <ToolbarButton
        tooltip={HEADING_OPTIONS.h2.tooltip}
        icon={HEADING_OPTIONS.h2.icon}
        onClick={() => formatBlock(HEADING_TYPES.H2)}
        isSelected={toolbarState.blockType === HEADING_TYPES.H2}
      />

      <ToolbarButton
        tooltip={HEADING_OPTIONS.h3.tooltip}
        icon={HEADING_OPTIONS.h3.icon}
        onClick={() => formatBlock(HEADING_TYPES.H3)}
        isSelected={toolbarState.blockType === HEADING_TYPES.H3}
      />

      <Divider />

      <ToolbarButton
        tooltip={INLINE_STYLE_OPTIONS.bold.tooltip}
        icon={INLINE_STYLE_OPTIONS.bold.icon}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, INLINE_STYLE_TYPES.BOLD);
        }}
        isSelected={toolbarState.isBold}
      />

      <ToolbarButton
        tooltip={INLINE_STYLE_OPTIONS.italic.tooltip}
        icon={INLINE_STYLE_OPTIONS.italic.icon}
        onClick={() => {
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            INLINE_STYLE_TYPES.ITALIC
          );
        }}
        isSelected={toolbarState.isItalic}
      />

      <ToolbarButton
        tooltip={INLINE_STYLE_OPTIONS.strikethrough.tooltip}
        icon={INLINE_STYLE_OPTIONS.strikethrough.icon}
        onClick={() => {
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            INLINE_STYLE_TYPES.STRIKETHROUGH
          );
        }}
        isSelected={toolbarState.isStrikethrough}
      />

      <ToolbarButton
        tooltip={INLINE_STYLE_OPTIONS.code.tooltip}
        icon={INLINE_STYLE_OPTIONS.code.icon}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, INLINE_STYLE_TYPES.CODE);
        }}
        isSelected={toolbarState.isCode}
      />

      <Divider />

      <ToolbarButton
        tooltip={BLOCK_OPTIONS.ul.tooltip}
        icon={BLOCK_OPTIONS.ul.icon}
        onClick={() => formatList(BLOCK_TYPES.UL)}
        isSelected={toolbarState.blockType === BLOCK_TYPES.UL}
      />

      <ToolbarButton
        tooltip={BLOCK_OPTIONS.ol.tooltip}
        icon={BLOCK_OPTIONS.ol.icon}
        onClick={() => formatList(BLOCK_TYPES.OL)}
        isSelected={toolbarState.blockType === BLOCK_TYPES.OL}
      />

      <ToolbarButton
        tooltip={BLOCK_OPTIONS.quote.tooltip}
        icon={BLOCK_OPTIONS.quote.icon}
        onClick={() => formatBlock(BLOCK_TYPES.QUOTE)}
        isSelected={toolbarState.blockType === BLOCK_TYPES.QUOTE}
      />

      <Divider />

      <ToolbarButton
        tooltip={TEXT_ALIGN_OPTIONS.left.tooltip}
        icon={TEXT_ALIGN_OPTIONS.left.icon}
        onClick={() => formatTextAlignment(TEXT_ALIGN_TYPES.LEFT)}
        isSelected={toolbarState.textAlignType === TEXT_ALIGN_TYPES.LEFT}
      />

      <ToolbarButton
        tooltip={TEXT_ALIGN_OPTIONS.center.tooltip}
        icon={TEXT_ALIGN_OPTIONS.center.icon}
        onClick={() => formatTextAlignment(TEXT_ALIGN_TYPES.CENTER)}
        isSelected={toolbarState.textAlignType === TEXT_ALIGN_TYPES.CENTER}
      />

      <ToolbarButton
        tooltip={TEXT_ALIGN_OPTIONS.right.tooltip}
        icon={TEXT_ALIGN_OPTIONS.right.icon}
        onClick={() => formatTextAlignment(TEXT_ALIGN_TYPES.RIGHT)}
        isSelected={toolbarState.textAlignType === TEXT_ALIGN_TYPES.RIGHT}
      />
    </Toolbar>
  );
});
