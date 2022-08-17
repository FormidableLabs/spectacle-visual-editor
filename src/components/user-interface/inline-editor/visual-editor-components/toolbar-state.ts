import { RangeSelection, LexicalEditor } from 'lexical';
import { $isListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isCodeNode, getDefaultCodeLanguage } from '@lexical/code';
import { TEXT_ALIGN_TYPES } from '../../../../constants/md-style-options';

export class ToolbarState {
  _blockType: string = 'paragraph';
  _codeLanguage: string = '';
  _textAlignType: number = 0;
  selection?: RangeSelection;

  constructor(editor: LexicalEditor, selection: RangeSelection | null) {
    if (!selection) return;

    this.selection = selection;
    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
    const elementKey = element.getKey();
    const elementDOM = editor.getElementByKey(elementKey);
    if (elementDOM !== null) {
      this._blockType =
        $isHeadingNode(element) || $isListNode(element)
          ? element.getTag()
          : element.getType();

      if ($isCodeNode(element)) {
        this._codeLanguage = element.getLanguage() || getDefaultCodeLanguage();
      }
    }

    const node = anchorNode.getParentOrThrow();
    this._textAlignType = node.getFormat();
  }

  get blockType() {
    return this._blockType;
  }

  get codeLanguage() {
    return this._codeLanguage;
  }

  get textAlignType() {
    switch (this._textAlignType) {
      case 3:
        return TEXT_ALIGN_TYPES.RIGHT;
      case 2:
        return TEXT_ALIGN_TYPES.CENTER;
      default:
        return TEXT_ALIGN_TYPES.LEFT;
    }
  }

  get isBold() {
    return !!this.selection?.hasFormat('bold');
  }

  get isItalic() {
    return !!this.selection?.hasFormat('italic');
  }

  get isUnderline() {
    return !!this.selection?.hasFormat('underline');
  }

  get isStrikethrough() {
    return !!this.selection?.hasFormat('strikethrough');
  }

  get isCode() {
    return !!this.selection?.hasFormat('code');
  }
}
