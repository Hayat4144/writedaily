import {
    ELEMENT_CODE_LINE,
    ELEMENT_LINK,
    ELEMENT_OL,
    ELEMENT_UL,
} from '@/lib/constant';
import editorUtility from '@/lib/editorUtility';
import generateNodeId from '@/lib/generateNodeId';
import {
    MyBulletedListElement,
    MyCodeLineELement,
    MyCustomElement,
    MyLinkElement,
    MyListItemElement,
    MyNumberListElement,
    MyParagraphElement,
} from '@/types';
import { Editor, Element, Range, Transforms } from 'slate';

const withMarkdown = (editor: Editor) => {
    const { insertText } = editor;

    editor.insertText = (text) => {
        const { selection } = editor;
        if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection;
            const block = Editor.above(editor, {
                match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];

            const start = Editor.start(editor, path);

            const range = { anchor, focus: start };

            const beforeText = Editor.string(editor, range) + text.slice(0, -1);

            const isBlockExist =
                editorUtility.MARKDOWN_SHORTCUT.hasOwnProperty(beforeText);

            if (isBlockExist) {
                const blockType = editorUtility.MARKDOWN_SHORTCUT[beforeText];
                Transforms.select(editor, range);

                if (!Range.isCollapsed(range)) {
                    Transforms.delete(editor);
                }

                const newElement: Partial<Element> = {
                    id: generateNodeId(),
                    type: blockType as any,
                };

                if (blockType === ELEMENT_UL || blockType === ELEMENT_OL) {
                    const listElement: Partial<MyListItemElement> = {
                        id: generateNodeId(),
                        type: 'list',
                    };

                    Transforms.setNodes<Element>(editor, listElement, {
                        match: (node) => Element.isElement(node),
                    });

                    const listType =
                        blockType === ELEMENT_UL
                            ? ELEMENT_UL
                            : ELEMENT_OL;
                    const listWrapper: Partial<
                        MyBulletedListElement | MyNumberListElement
                    > = {
                        id: generateNodeId(),
                        type: listType,
                    };

                    Transforms.wrapNodes(editor, listWrapper as MyCustomElement, {
                        split: true,
                    });
                } else if (blockType === ELEMENT_LINK) {
                    const linkElement: MyLinkElement = {
                        type: 'link',
                        url: 'http://example.com',
                        children: [{ text: 'your link' }],
                    };

                    Transforms.insertNodes(editor, linkElement, {
                        at: selection,
                    });

                    Transforms.move(editor, {
                        distance: 2,
                        unit: 'word',
                        reverse: false,
                    });
                } else if (blockType === ELEMENT_CODE_LINE) {
                    const paraElement: Partial<MyParagraphElement> = {
                        id: generateNodeId(),
                        type: 'paragraph',
                        children: [{ text: '    ' }],
                    };
                    const codelink: Partial<MyCodeLineELement> = {
                        type: 'code_line',
                    };
                    Transforms.setNodes(editor, codelink);
                    Transforms.wrapNodes(editor, paraElement as Element, { split: true });
                    Transforms.collapse(editor, { edge: 'end' });
                } else {
                    Transforms.setNodes<Element>(editor, newElement);
                }
                return;
            }
        }
        insertText(text);
    };

    return editor;
};

export default withMarkdown;
