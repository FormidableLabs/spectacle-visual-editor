import type { ElementTransformer } from '@lexical/markdown';
import {
  $createParagraphNode,
  $createTextNode,
  $createLineBreakNode,
  $isElementNode,
  $isParagraphNode
} from 'lexical';
import {
  TRANSFORMERS as LEXICAL_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS
} from '@lexical/markdown';
import {
  createTextFormatTransformersIndex,
  importTextFormatTransformers,
  transformersByType
} from './markdown-import';

/**
 * Transforms paragraph markdown to include line break nodes in between lines
 * rather than rendering separate paragraph blocks.
 */
const PARAGRAPH: ElementTransformer = {
  export: (node, exportChildren) => {
    if (!$isElementNode(node)) return null;
    return exportChildren(node);
  },
  regExp: /[\s\S]*/,
  replace: (parentNode, children, match) => {
    const node = $createParagraphNode();
    match.forEach((str) => {
      node.append($createTextNode(str));
    });
    parentNode.replace(node);

    node.getAllTextNodes().forEach((textNode) => {
      const byType = transformersByType([
        ...TEXT_FORMAT_TRANSFORMERS,
        ...TEXT_MATCH_TRANSFORMERS
      ]);
      const textFormatTransformersIndex = createTextFormatTransformersIndex(
        byType.textFormat
      );

      importTextFormatTransformers(
        textNode,
        textFormatTransformersIndex,
        byType.textMatch
      );
    });

    const existingParagraphNode = node
      .getTopLevelElement()
      ?.getPreviousSibling();

    if ($isParagraphNode(existingParagraphNode)) {
      children.forEach((node) => {
        if (node.getTextContent() === '') {
          existingParagraphNode.append($createLineBreakNode());
        }
      });
      node.getChildren().forEach((node) => {
        existingParagraphNode.append(node);
      });
      node.remove();
    }
  },
  type: 'element'
};

export { LEXICAL_TRANSFORMERS };
export const TRANSFORMERS = [...LEXICAL_TRANSFORMERS, PARAGRAPH];
