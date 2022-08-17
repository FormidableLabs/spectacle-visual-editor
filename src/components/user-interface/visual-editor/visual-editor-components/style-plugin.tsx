import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, ElementFormatType } from 'lexical';
import { getStyleObjectFromCSS } from '@lexical/selection';
import { useCallback } from 'react';
import { css } from 'styled-components';
import { useVisualEditorContext } from '../visual-editor';
import { useVisualEditorUpdate } from '../../../../hooks';

/**
 * StylePlugin is a lexical visual editor plugin that applies DeckElement componentProps to rich text elements
 */
export const StylePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const { selectedElementComponentProps } = useVisualEditorContext();

  const updateComponentProps = useCallback(
    (isReadOnly?: boolean) => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const root = anchorNode.getParents().find((p) => p.getKey() === 'root');
        const textNodes = root?.getAllTextNodes();

        textNodes?.forEach((textNode) => {
          const element = textNode.getParentOrThrow();
          const elementKey = element.getKey();
          const elementDOM = editor.getElementByKey(elementKey);

          if (elementDOM !== null) {
            const componentProps = selectedElementComponentProps;
            const props = {
              ...getStyleObjectFromCSS(elementDOM.getAttribute('style') ?? ''),
              ...componentProps
            };
            const style = css(props).join(' ');
            elementDOM.setAttribute('style', style);

            if (!!props.textAlign && !isReadOnly) {
              element.setFormat(props.textAlign as ElementFormatType);
            }
          }
        });
      }
    },
    [editor, selectedElementComponentProps]
  );

  useVisualEditorUpdate(editor, updateComponentProps);

  return null;
};
