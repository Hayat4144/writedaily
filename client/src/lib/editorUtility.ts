import { editorUtility as EditorUtility } from '@/types/EditorUtility';
import { Editor, Element, Node, Transforms } from 'slate';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';

const editorUtility: EditorUtility = {
    isBlockActive(editor: Editor, block: string): boolean {
        const { selection } = editor;
        if (!selection) {
            return false;
        }
        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: (n) =>
                    !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    n.type === block,
            }),
        );
        return !!match;
    },

    unwrapNodes(editor: Editor, node: string) {
        Transforms.unwrapNodes(editor, {
            match: (n) =>
                !Editor.isEditor(n) && Element.isElement(n) && n.type === node,
        });
    },

    updateLink(editor: Editor, url: string) {
        const { selection } = editor;
        if (!selection) return;
        const isLinkActive = editorUtility.isBlockActive(editor, 'link');
        if (!isLinkActive) return;
        const linkNodePath = ReactEditor.findPath(
            editor,
            Node.parent(editor, selection?.focus.path),
        );
        Transforms.setNodes(editor, { url }, { at: linkNodePath });
    },
    getBlock(editor: Editor, block: string) {
        const [match] = Array.from(
            Editor.nodes(editor, {
                match: (n) =>
                    !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    n.type === block,
            }),
        );
        return match;
    },
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
};

export default editorUtility;
