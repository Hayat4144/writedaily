import { editorUtility as EditorUtility } from '@/types/EditorUtility';
import { Editor } from 'slate';

const editorUtility: EditorUtility = {
    getActiveMark(editor: Editor): Set<string> {
        return new Set(Object.keys(Editor.marks(editor) ?? {}));
    },
    toggleMark(editor: Editor, format: string, value: string | boolean) {
        const activeMark = editorUtility.getActiveMark(editor);
        if (activeMark.has(format)) {
            Editor.removeMark(editor, format);
        } else {
            Editor.addMark(editor, format, value);
        }
    },
};

export default editorUtility;
