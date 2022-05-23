import { LexicalEditor, SELECTION_CHANGE_COMMAND } from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useEffect } from 'react';

const LowPriority = 1;

/**
 * Implements a callback parameter that is registered when a LexicalEditor is updated
 */
export const useVisualEditorUpdate = (
  editor: LexicalEditor,
  callback: (isReadOnly?: boolean) => void
) => {
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          callback(true);
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          callback(false);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, callback]);
};
