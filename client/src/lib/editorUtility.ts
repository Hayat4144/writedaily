import { editorUtility as EditorUtility } from '@/types/EditorUtility';
import { Editor, Element, Node, Range, Transforms } from 'slate';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';
import { ELEMENT_OL, ELEMENT_UL } from './constant';
import { MyCustomElement } from '@/types';

const editorUtility: EditorUtility = {
    TEXT_ALIGN_TYPES: ['left', 'center', 'justify', 'right'],
    LIST_TYPES: [ELEMENT_UL, ELEMENT_OL],

    getActiveBlock(editor) {
        const { selection } = editor;
        if (!selection) return null;

        const [start, end] = Range.edges(selection);

        //path[0] gives us the index of the top-level block.
        let startTopLevelBlockIndex = start.path[0];
        const endTopLevelBlockIndex = end.path[0];

        let ParentElement: Element;
        while (startTopLevelBlockIndex <= endTopLevelBlockIndex) {
            const [node, _] = Editor.node(editor, [startTopLevelBlockIndex]);
            ParentElement = node as Element;
            startTopLevelBlockIndex++;
        }

        return ParentElement;
    },
    isAlignmentActive(editor, type) {
        const { selection } = editor;
        if (!selection) return false;

        const [[match]] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: (n) => !Editor.isEditor(n) && Element.isElement(n),
            }),
        );

        return !!match;
    },

    toggleAlignment(editor, type) {
        const { selection } = editor;
        if (!selection) return;

        let newProperties: Partial<Element>;

        newProperties = { align: type };

        Transforms.setNodes(editor, newProperties);
    },

    toggleBlock(editor, block) {
        const { selection } = editor;
        if (!selection) return;
        const isActive = editorUtility.isBlockActive(editor, block);

        Transforms.unwrapNodes(editor, {
            match: (n) =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                editorUtility.LIST_TYPES.includes(n.type) &&
                !editorUtility.TEXT_ALIGN_TYPES.includes(block),
            split: true,
        });

        let newProperties: Partial<Element>;

        const isList = editorUtility.LIST_TYPES.includes(block);
        newProperties = {
            type: isActive
                ? 'paragraph'
                : isList
                  ? 'list'
                  : (block as keyof typeof newProperties.type),
        };

        Transforms.setNodes(editor, newProperties);

        if (!isActive && isList) {
            Transforms.wrapNodes(editor, {
                type: block as keyof typeof newProperties.type,
                children: [],
            });
        }
    },
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
