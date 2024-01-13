import { ELEMENT_PARAGRAPH } from '@/lib/constant';
import generateNodeId from '@/lib/generateNodeId';
import { MyCustomElement } from '@/types';
import { Editor, Node, Transforms } from 'slate';

const withTrailingBlock = (editor: Editor) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = ([node, path]) => {
        if (Editor.isEditor(node)) {
            const lastNode = node.children[
                node.children.length - 1
            ] as MyCustomElement;
            if (
                !lastNode ||
                !Editor.isBlock(editor, lastNode) ||
                lastNode.type !== ELEMENT_PARAGRAPH
            ) {
                const newParagraph: Node = {
                    id: generateNodeId(),
                    type: 'paragraph',
                    children: [{ text: '' }],
                };

                Transforms.insertNodes(editor, newParagraph, {
                    at: [...path, node.children.length],
                });
                return;
            }
        }

        return normalizeNode([node, path]);
    };

    return editor;
};

export default withTrailingBlock;
