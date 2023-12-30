import { Editor } from 'slate';

export interface editorUtility {
    getActiveMark(editor: Editor): Set<string>;
    toggleMark(editor: Editor, format: string, value: string | boolean): void;
}
