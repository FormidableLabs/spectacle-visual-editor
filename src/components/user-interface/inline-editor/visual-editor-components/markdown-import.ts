/**
 * This source code is copied directly from: https://github.com/facebook/lexical/blob/main/packages/lexical-markdown/src/v2/MarkdownImport.ts
 * and exposes helper transformer methods that are not accessible from the npm package.
 * @todo: Open a PR with Lexical that exports these helper methods and then remove this file.
 */

import type {
  ElementTransformer,
  TextFormatTransformer,
  TextMatchTransformer,
  Transformer
} from '@lexical/markdown';
import type { TextNode } from 'lexical';

export function indexBy<T>(
  list: Array<T>,
  callback: (arg0: T) => string
): Readonly<Record<string, Array<T>>> {
  const index: any = {};

  for (const item of list) {
    const key = callback(item);

    if (index[key]) {
      index[key].push(item);
    } else {
      index[key] = [item];
    }
  }

  return index;
}

export function transformersByType(
  transformers: Array<Transformer>
): Readonly<{
  element: Array<ElementTransformer>;
  textFormat: Array<TextFormatTransformer>;
  textMatch: Array<TextMatchTransformer>;
}> {
  const byType = indexBy(transformers, (t) => t.type);

  return {
    element: byType.element as Array<ElementTransformer>,
    textFormat: byType['text-format'] as Array<TextFormatTransformer>,
    textMatch: byType['text-match'] as Array<TextMatchTransformer>
  };
}

export const PUNCTUATION_OR_SPACE = /[!-/:-@[-`{-~\s]/;

type TextFormatTransformersIndex = Readonly<{
  fullMatchRegExpByTag: Readonly<Record<string, RegExp>>;
  openTagsRegExp: RegExp;
  transformersByTag: Readonly<Record<string, TextFormatTransformer>>;
}>;

// Processing text content and replaces text format tags.
// It takes outermost tag match and its content, creates text node with
// format based on tag and then recursively executed over node's content
//
// E.g. for "*Hello **world**!*" string it will create text node with
// "Hello **world**!" content and italic format and run recursively over
// its content to transform "**world**" part
export function importTextFormatTransformers(
  textNode: TextNode,
  textFormatTransformersIndex: TextFormatTransformersIndex,
  textMatchTransformers: Array<TextMatchTransformer>
) {
  const textContent = textNode.getTextContent();
  const match = findOutermostMatch(textContent, textFormatTransformersIndex);
  if (!match) {
    // Once text format processing is done run text match transformers, as it
    // only can span within single text node (unline formats that can cover multiple nodes)
    importTextMatchTransformers(textNode, textMatchTransformers);
    return;
  }
  let currentNode, remainderNode;
  // If matching full content there's no need to run splitText and can reuse existing textNode
  // to update its content and apply format. E.g. for **_Hello_** string after applying bold
  // format (**) it will reuse the same text node to apply italic (_)
  if (match[0] === textContent) {
    currentNode = textNode;
  } else {
    const startIndex = match.index;
    const endIndex = startIndex! + match[0].length;
    if (startIndex === 0) {
      [currentNode, remainderNode] = textNode.splitText(endIndex);
    } else {
      [, currentNode, remainderNode] = textNode.splitText(
        startIndex!,
        endIndex
      );
    }
  }
  currentNode.setTextContent(match[2]);
  const transformer = textFormatTransformersIndex.transformersByTag[match[1]];
  if (transformer) {
    for (const format of transformer.format) {
      if (!currentNode.hasFormat(format)) {
        currentNode.toggleFormat(format);
      }
    }
  }
  // Recursively run over inner text if it's not inline code
  if (!currentNode.hasFormat('code')) {
    importTextFormatTransformers(
      currentNode,
      textFormatTransformersIndex,
      textMatchTransformers
    );
  }
  // Run over remaining text if any
  if (remainderNode) {
    importTextFormatTransformers(
      remainderNode,
      textFormatTransformersIndex,
      textMatchTransformers
    );
  }
}

function importTextMatchTransformers(
  textNode_: TextNode,
  textMatchTransformers: Array<TextMatchTransformer>
) {
  let textNode = textNode_;

  mainLoop: while (textNode) {
    for (const transformer of textMatchTransformers) {
      const match = textNode.getTextContent().match(transformer.importRegExp);

      if (!match) {
        continue;
      }

      const startIndex = match.index;
      const endIndex = startIndex! + match[0].length;
      let replaceNode;

      if (startIndex === 0) {
        [replaceNode, textNode] = textNode.splitText(endIndex);
      } else {
        [, replaceNode, textNode] = textNode.splitText(startIndex!, endIndex);
      }

      transformer.replace(replaceNode, match);
      continue mainLoop;
    }

    break;
  }
}

// Finds first "<tag>content<tag>" match that is not nested into another tag
function findOutermostMatch(
  textContent: string,
  textTransformersIndex: TextFormatTransformersIndex
): RegExpMatchArray | null {
  const openTagsMatch = textContent.match(textTransformersIndex.openTagsRegExp);

  if (openTagsMatch == null) {
    return null;
  }

  for (const match of openTagsMatch) {
    // Open tags reg exp might capture leading space so removing it
    // before using match to find transformer
    const tag = match.replace(/^\s/, '');
    const fullMatchRegExp = textTransformersIndex.fullMatchRegExpByTag[tag];
    if (fullMatchRegExp == null) {
      continue;
    }

    const fullMatch = textContent.match(fullMatchRegExp);
    const transformer = textTransformersIndex.transformersByTag[tag];
    if (fullMatch != null && transformer != null) {
      // For non-intraword transformers checking if it's within a word
      // or surrounded with space/punctuation/newline
      const { index } = fullMatch;
      const beforeChar = textContent[index! - 1];
      const afterChar = textContent[index! + fullMatch[0].length];

      if (
        (!beforeChar || PUNCTUATION_OR_SPACE.test(beforeChar)) &&
        (!afterChar || PUNCTUATION_OR_SPACE.test(afterChar))
      ) {
        return fullMatch;
      }
    }
  }

  return null;
}

export function createTextFormatTransformersIndex(
  textTransformers: Array<TextFormatTransformer>
): TextFormatTransformersIndex {
  const transformersByTag: any = {};
  const fullMatchRegExpByTag: any = {};
  const openTagsRegExp = [];

  for (const transformer of textTransformers) {
    const { tag } = transformer;
    transformersByTag[tag] = transformer;
    const tagRegExp = tag.replace(/(\*|\^)/g, '\\$1');
    openTagsRegExp.push(tagRegExp);
    fullMatchRegExpByTag[tag] = new RegExp(
      `(${tagRegExp})(?![${tagRegExp}\\s])(.*?[^${tagRegExp}\\s])${tagRegExp}(?!${tagRegExp})`
    );
  }

  return {
    // Reg exp to find open tag + content + close tag
    fullMatchRegExpByTag,
    // Reg exp to find opening tags
    openTagsRegExp: new RegExp('(' + openTagsRegExp.join('|') + ')', 'g'),
    transformersByTag
  };
}
