import { LexicalEditor, SELECTION_CHANGE_COMMAND } from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useEffect } from 'react';

const LowPriority = 1;

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
          callback();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, callback]);
};
