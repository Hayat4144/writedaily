import { editorUtility as EditorUtility } from '@/types/EditorUtility';
import { Editor, Transforms } from 'slate';
import isHotkey from 'is-hotkey';

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
    HOT_KEYS: {
        'mod+b': 'bold',
        'mod+i': 'italic',
        'mod+u': 'underline',
        'mod+m': 'subscript',
    },
    onkeydown(event: React.KeyboardEvent, editor: Editor) {
        console.log(event.key, event.code);
        for (const hotkey in editorUtility.HOT_KEYS) {
            if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const markType = editorUtility.HOT_KEYS[hotkey];
                editorUtility.toggleMark(editor, markType, true);
            }
            if (isHotkey('tab', event)) {
                event.preventDefault();
                Transforms.insertText(editor, '    ');
            }
        }
    },
    isBlockActive: (editor: Editor, format: string, blockType = 'type') => {
        const { selection } = editor;
        if (!selection) return false;

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: (n) =>
                    !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    n[blockType as keyof typeof n] === format,
            }),
        );

        return !!match;
    },
};

export default editorUtility;
