import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, ElementFormatType } from 'lexical';
import { useCallback } from 'react';
import { css } from 'styled-components';
import { useVisualEditorContext } from '../visual-editor';
import { useVisualEditorUpdate } from '../../../../hooks';

const formatStringToCamelCase = (str: string) => {
  const splitted = str.split('-');
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('')
  );
};

const getStyleObjectFromString = (str: string | null) => {
  const style: { [key: string]: string } = {};
  if (!str) return style;
  str.split(';').forEach((el) => {
    const [property, value] = el.split(':');
    if (!property) return;

    const formattedProperty = formatStringToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });

  return style;
};

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
              ...getStyleObjectFromString(elementDOM.getAttribute('style')),
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
