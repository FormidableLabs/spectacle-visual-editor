import {
  $createParagraphNode,
  $isElementNode,
  $isLineBreakNode,
  $isParagraphNode,
  $isTextNode,
  ElementNode,
  ParagraphNode,
  RangeSelection,
  TextNode
} from 'lexical';
import { $isListNode } from '@lexical/list';

/**
 * Creates a 2 dimensional array of TextNodes. The 1st dimension indicates a paragraph line of
 * textNodes and the 2nd dimension is an array of each textNode on that line (ie. bold, italic, ...inline styles).
 */
const getParagraphLineData = (node: ParagraphNode) => {
  const children = node.getChildren();
  const lineMatrix = children
    .filter((node) => $isTextNode(node) || $isLineBreakNode(node))
    .reduce(
      (acc, node) => {
        if ($isLineBreakNode(node)) {
          acc.push([]);
          node.remove();
        } else acc[acc.length - 1].push(node as TextNode);
        return acc;
      },
      [[]] as TextNode[][]
    );
  return lineMatrix;
};

const wrapNonParagraphNodes = (
  node: ElementNode,
  createElement: () => ElementNode
) => {
  if ($isListNode(node)) return;
  const children = node.getChildren();
  const element = createElement();
  const nodes = children.filter((node) => $isTextNode(node));

  nodes.forEach((node) => element.append(node));
  node.replace(element);
};

/**
 * Helper method that replaces https://github.com/facebook/lexical/blob/main/packages/lexical-selection/src/index.ts#L569
 * and ensures that element nodes are converted by line rather than by element node.
 */
export const $wrapLeafNodesInElements = (
  selection: RangeSelection,
  createElement: () => ElementNode
) => {
  const nodes = selection.getNodes();
  const elements = nodes.filter((node) =>
    $isElementNode(node)
  ) as ElementNode[];
  const textNodes = nodes.filter((node) => $isTextNode(node)) as TextNode[];

  elements.forEach((node) => {
    if ($isParagraphNode(node)) {
      const lineMatrix = getParagraphLineData(node);
      lineMatrix.reverse().forEach((nodes) => {
        if (nodes.length === 0) return;
        const element = createElement();
        nodes.forEach((node) => element.append(node));
        node.insertAfter(element);
        if (node.getChildrenSize() === 0) node.remove();
      });
    } else {
      wrapNonParagraphNodes(node, createElement);
    }
  });

  textNodes.forEach((node) => {
    const parentNode = node.getParentOrThrow();
    if ($isParagraphNode(parentNode)) {
      const lineMatrix = getParagraphLineData(parentNode);
      const nodes = lineMatrix.find((nodes) => nodes.find((n) => n === node));
      if (!nodes || nodes?.length === 0) return;
      lineMatrix.reverse().forEach((nodes) => {
        if (nodes.length === 0) return;
        const element = nodes.find((n) =>
          textNodes.find((textNode) => textNode === n)
        )
          ? createElement()
          : $createParagraphNode();

        nodes.forEach((node) => element.append(node));
        parentNode.insertAfter(element);
        if (parentNode.getChildrenSize() === 0) parentNode.remove();
      });
    } else {
      wrapNonParagraphNodes(parentNode, createElement);
    }
  });
};
