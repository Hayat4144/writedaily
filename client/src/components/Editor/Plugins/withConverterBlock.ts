import { ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LIST } from '@/lib/constant';
import editorUtility from '@/lib/editorUtility';
import generateNodeId from '@/lib/generateNodeId';
import { MyParagraphElement } from '@/types';
import { Editor, Element, Point, Range, Transforms } from 'slate';

const withConverterBlock = (editor: Editor) => {
    const { deleteBackward } = editor;

    editor.deleteBackward = (...arg) => {
        const { selection } = editor;
        const blocktype: { [key: string]: string } = {
            '1': ELEMENT_TODO_LIST,
            '2': ELEMENT_BLOCKQUOTE,
        };

        for (const m in blocktype) {
            if (selection && Range.isCollapsed(selection)) {
                const match = editorUtility.getBlock(editor, blocktype[m]);

                if (match) {
                    const [, path] = match;
                    const start = Editor.start(editor, path);
                    if (Point.equals(selection.anchor, start)) {
                        const newProperties: Partial<MyParagraphElement> = {
                            type: 'paragraph',
                            id: generateNodeId(),
                        };
                        Transforms.setNodes(editor, newProperties, {
                            match: (n) =>
                                !Editor.isEditor(n) &&
                                Element.isElement(n) &&
                                n.type === blocktype[m],
                        });
                        return;
                    }
                }
            }
        }
        deleteBackward(...arg);
    };

    return editor;
};

export default withConverterBlock;
