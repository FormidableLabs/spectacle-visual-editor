import {
  $getSelection,
  $isRangeSelection,
  $isParagraphNode,
  COMMAND_PRIORITY_LOW,
  INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  $getRoot,
  $isElementNode,
  $isLineBreakNode,
  $createParagraphNode,
  ElementNode,
  ParagraphNode,
  $createLineBreakNode
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { $isCodeNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

type Paragraph = { node: ParagraphNode; index: number };
const indexOfParagraphMatrix = (
  array: Paragraph[][],
  index: number
): [number, number] | null => {
  let i = 0;
  for (i; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j].index === index) return [i, j];
    }
  }
  return null;
};

/**
 * Consolidates all consecutive paragraph blocks into a single paragraph
 * block separated by line break nodes.
 */
export const $consolidateParagraphNodes = () => {
  const rootChildren = $getRoot().getChildren();
  const paragraphElementNodes: Paragraph[] = (
    rootChildren.filter(
      (node) => $isElementNode(node) && $isParagraphNode(node)
    ) as ParagraphNode[]
  ).map((node) => ({
    node,
    index: node.getIndexWithinParent()
  }));

  const paragraphMatrix = paragraphElementNodes
    .reduce((acc, paragraph) => {
      const prevIndex = paragraph.index - 1;
      const indices = indexOfParagraphMatrix(acc, prevIndex);
      if (indices) acc[indices[0]].push(paragraph);
      else acc.push([paragraph]);
      return acc;
    }, [] as Paragraph[][])
    .map((array) =>
      array
        .map(({ node }, i) => {
          if (i !== array.length - 1) {
            node.append($createLineBreakNode());
          }
          return node.getChildren();
        })
        .flat()
    );

  const currentParagraphMatrix = paragraphElementNodes.map(({ node }) =>
    node.getChildren().flat()
  );

  const isParagraphMatrixChange = () => {
    for (let i = 0; i < paragraphMatrix.length; i++)
      for (let j = 0; j < paragraphMatrix[i].length; j++)
        if (paragraphMatrix[i][j] !== currentParagraphMatrix[i][j]) return true;

    return false;
  };

  if (isParagraphMatrixChange()) {
    paragraphMatrix.forEach((paragraph) => {
      paragraph.forEach((node) => {
        const parentNode = paragraph[0].getParentOrThrow();
        const p = node.getParentOrThrow();
        if (!p || !parentNode) return;
        parentNode.append(node);
        if (p !== parentNode) p.remove();
      });
    });
  }
};

/**
 * Removes line break nodes from every element node that isn't a paragraph node, and
 * renders a new paragraph node in its place.
 */
export const $sanitizeLineBreaks = () => {
  const rootChildren = $getRoot().getChildren();
  const nonParagraphElementNodes = rootChildren.filter(
    (node) =>
      $isElementNode(node) && !$isParagraphNode(node) && !$isCodeNode(node)
  ) as ElementNode[];

  nonParagraphElementNodes.forEach((node) => {
    const lineBreakNode = node
      .getChildren()
      .find((node) => $isLineBreakNode(node));
    if (!lineBreakNode) return;

    const lineBreakIndex = lineBreakNode.getIndexWithinParent();
    const paragraphNode = $createParagraphNode();

    node
      .getChildren()
      .filter((_, i) => i > lineBreakIndex)
      .forEach((node) => paragraphNode.append(node));

    node.insertAfter(paragraphNode);
    lineBreakNode.remove();
  });
};

/**
 * The [shift] + [return/enter] or [return/enter] key will create a line break node for
 * paragraph nodes every time, otherwise a new paragraph will be created. In other words,
 * line breaks are only possible for every element node other than paragraph nodes.
 */
export const LineBreakPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }

          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === 'root'
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();

          if (!$isParagraphNode(element)) {
            selection.insertParagraph();
          } else {
            editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND, false);
          }

          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_LINE_BREAK_COMMAND,
        (selectStart: boolean) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }

          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === 'root'
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();

          if (!$isParagraphNode(element)) {
            editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
          } else {
            selection.insertLineBreak(selectStart);
          }

          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
};
