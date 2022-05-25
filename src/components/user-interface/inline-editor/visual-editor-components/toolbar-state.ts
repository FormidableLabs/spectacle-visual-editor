import { RangeSelection, LexicalEditor } from 'lexical';
import { $isListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isCodeNode, getDefaultCodeLanguage } from '@lexical/code';
import { TEXT_ALIGN_TYPES } from '../../../../constants/md-style-options';

export class ToolbarState {
  private _blockType: string = 'paragraph';
  private _codeLanguage: string = '';
  private _textAlignType: number = 0;

  constructor(editor: LexicalEditor, public selection: RangeSelection | null) {
    if (!selection) return;

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

  public get blockType() {
    return this._blockType;
  }

  public get codeLanguage() {
    return this._codeLanguage;
  }

  public get textAlignType() {
    switch (this._textAlignType) {
      case 3:
        return TEXT_ALIGN_TYPES.RIGHT;
      case 2:
        return TEXT_ALIGN_TYPES.CENTER;
      default:
        return TEXT_ALIGN_TYPES.LEFT;
    }
  }

  public get isBold() {
    return !!this.selection?.hasFormat('bold');
  }

  public get isItalic() {
    return !!this.selection?.hasFormat('italic');
  }

  public get isUnderline() {
    return !!this.selection?.hasFormat('underline');
  }

  public get isStrikethrough() {
    return !!this.selection?.hasFormat('strikethrough');
  }

  public get isCode() {
    return !!this.selection?.hasFormat('code');
  }
}
