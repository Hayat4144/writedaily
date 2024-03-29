import { editorUtility as EditorUtility } from '@/types/EditorUtility';
import {
    BasePoint,
    Editor,
    Element,
    Node,
    Point,
    Range,
    Text,
    Transforms,
} from 'slate';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';
import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_LINK,
    ELEMENT_OL,
    ELEMENT_UL,
    ELEMENT_CODE_LINE,
} from './constant';
import {
    MyBlockElement,
    MyImageELement,
    MyLinkElement,
    MyParagraphElement,
    RichText,
} from '@/types';
import generateNodeId from './generateNodeId';
import isUrl from 'is-url';
import uploadFile from '@/externalapi/uploadFile';
import { toast } from 'sonner';

const editorUtility: EditorUtility = {
    TEXT_ALIGN_TYPES: ['left', 'center', 'justify', 'right'],
    LIST_TYPES: [ELEMENT_UL, ELEMENT_OL],

    MARKDOWN_SHORTCUT: {
        '*': ELEMENT_UL,
        '-': ELEMENT_UL,
        '+': ELEMENT_OL,
        '1': ELEMENT_OL,
        '[]': ELEMENT_LINK,
        '>': ELEMENT_BLOCKQUOTE,
        '#': ELEMENT_H1,
        '##': ELEMENT_H2,
        '###': ELEMENT_H3,
        '####': ELEMENT_H4,
        '#####': ELEMENT_H5,
        '######': ELEMENT_H6,
        '``': ELEMENT_CODE_LINE,
    },

    async uploadImage(editor, files, token, id) {
        try {
            let formData = new FormData();
            for (const file of files) {
                const [mime] = file.type.split('/');
                if (mime === 'image') {
                    formData.append('images', file);
                }
            }
            const { data, error } = await uploadFile(formData);

            if (error) {
                toast(error);
            } else {
                data.map((image: any) => {
                    const ImageElement: MyImageELement = {
                        id: generateNodeId(),
                        url: image.url,
                        children: [{ text: '' }],
                        type: 'image',
                    };
                    editorUtility.insertNode<MyImageELement>(
                        editor,
                        ImageElement,
                    );
                });
            }

            return error ? false : true;
        } catch (error) {
            toast('Something went wrong, please try again.', {
                description: 'There might be a network issue.',
                action: {
                    label: 'Cancel',
                    onClick: () => console.log('Cancel'),
                },
            });
            return false;
        }
    },

    createLinkForRange: (editor, range, linkText, linkURL, isInsertion) => {
        const linkElement: MyLinkElement = {
            type: ELEMENT_LINK,
            url: linkURL,
            children: [{ text: linkText }],
        };
        isInsertion
            ? Transforms.insertNodes(
                  editor,
                  linkElement,
                  range != null ? { at: range } : undefined,
              )
            : Transforms.wrapNodes(editor, linkElement, {
                  split: true,
                  at: range,
              });
    },
    identifyLink(editor) {
        if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
            return;
        }

        const [node] = Editor.parent(editor, editor.selection);
        if ((node as any).type === 'link') {
            return;
        }

        const [currentNode, currentNodePath] = Editor.node(
            editor,
            editor.selection,
        );
        if (!Text.isText(currentNode)) {
            return;
        }

        let [start] = Range.edges(editor.selection);
        const cursorPoint = start;

        const startPointOfLastCharacter = Editor.before(
            editor,
            editor.selection,
            {
                unit: 'character',
            },
        );
        if (!startPointOfLastCharacter || !start) return;
        let lastCharacter = Editor.string(
            editor,
            Editor.range(editor, startPointOfLastCharacter, cursorPoint),
        );

        if (lastCharacter !== ' ') {
            return;
        }

        let end = startPointOfLastCharacter;
        start = Editor.before(editor, end, {
            unit: 'character',
        }) as BasePoint;

        const startOfTextNode = Editor.point(editor, currentNodePath, {
            edge: 'start',
        });

        lastCharacter = Editor.string(editor, Editor.range(editor, start, end));

        while (
            lastCharacter !== ' ' &&
            !Point.isBefore(start, startOfTextNode)
        ) {
            end = start;
            start = Editor.before(editor, end, {
                unit: 'character',
            }) as BasePoint;
            lastCharacter = Editor.string(
                editor,
                Editor.range(editor, start, end),
            );
        }

        const lastWordRange = Editor.range(
            editor,
            end,
            startPointOfLastCharacter,
        );
        const lastWord = Editor.string(editor, lastWordRange);

        if (isUrl(lastWord)) {
            Promise.resolve().then(() =>
                editorUtility.createLinkForRange(
                    editor,
                    lastWordRange,
                    lastWord,
                    lastWord,
                    false,
                ),
            );
        }
    },
    emptyNode: (editor) => {
        const { selection } = editor;

        if (selection) {
            const [start] = Range.edges(selection);
            const characterBefore = Editor.before(editor, start, {
                unit: 'character',
            });
            Transforms.delete(editor, { at: characterBefore });
            Transforms.setNodes(editor, { text: ' ' });
        }
    },
    detectCommandMenu(editor, toggleCommandMenu) {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
            const [start, end] = Range.edges(selection);
            const characterBefore = Editor.before(editor, start, {
                unit: 'offset',
            });
            const before =
                characterBefore && Editor.before(editor, characterBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
                beforeRange && Editor.string(editor, beforeRange);
            if (beforeText?.endsWith(' /')) {
                return toggleCommandMenu(true);
            }

            const [node] = Editor.node(editor, start.path);
            const matchtext = (node as RichText).text;
            if (matchtext.length === 1 && matchtext.endsWith('/')) {
                toggleCommandMenu(true);
            }
        }
    },

    insertEmoji(editor, range, text) {
        if (!range) return;
        Editor.before(editor, range, {
            unit: 'character',
        });
        Transforms.delete(editor, { at: range });
        Transforms.insertText(editor, text);
    },

    detectEmoji(props) {
        const { editor, setEmoji, setEmojiToggle, TargetRange } = props;

        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, {
                unit: 'word',
            });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
                beforeRange && Editor.string(editor, beforeRange);

            const beforeColonMatch = beforeText && beforeText.match(/^:(\w+)$/);

            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeColonMatch && afterMatch) {
                setEmoji(beforeColonMatch[1]);
                setEmojiToggle(true);
                TargetRange(beforeRange);
            } else {
                setEmoji('');
                setEmojiToggle(false);
            }
        }
    },

    toggleLink(editor, url) {
        const { selection } = editor;
        const isCollapsed = selection && Range.isCollapsed(selection);
        const isLinkActive = editorUtility.isBlockActive(editor, 'link');

        if (isLinkActive) {
            editorUtility.unwrapNodes(editor, ELEMENT_LINK);
        }

        const linkElement: MyLinkElement = {
            type: 'link',
            url,
            children: [{ text: 'Click here' }],
        };
        if (!selection) {
            editorUtility.insertNode(editor, linkElement);
            return;
        }

        if (isCollapsed) {
            editorUtility.insertNode(editor, linkElement);
        } else {
            Transforms.wrapNodes(editor, linkElement, { split: true });
            Transforms.collapse(editor, { edge: 'end' });
        }
    },

    insertNode(editor, node) {
        Transforms.insertNodes(editor, node);
        if (node.type === 'image') {
            const EmptyParagraph: MyParagraphElement = {
                id: generateNodeId(),
                type: 'paragraph',
                children: [{ text: '' }],
            };
            Transforms.insertNodes(editor, EmptyParagraph, { mode: 'highest' });
        }
    },

    removeBlock(editor, path) {
        Transforms.removeNodes(editor, { at: path });
    },

    getActiveBlock(editor) {
        const { selection } = editor;
        if (!selection) return null;

        const [start, end] = Range.edges(selection);

        //path[0] gives us the index of the top-level block.
        let startTopLevelBlockIndex = start.path[0];
        const endTopLevelBlockIndex = end.path[0];

        let ParentElement: Element | null = null;
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

        let newProperties: Partial<MyBlockElement>;

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
