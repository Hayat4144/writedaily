import { Editor } from 'slate';

export interface editorUtility {
    getActiveMark(editor: Editor): Set<string>;
    toggleMark(editor: Editor, format: string, value: string | boolean): void;
    HOT_KEYS: { [key: string]: string };
    onkeydown(event: React.KeyboardEvent, editor: Editor): void;
    isBlockActive(editor: Editor, format: string, blockType: string);
}
