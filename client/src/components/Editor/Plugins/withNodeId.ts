import { Editor as SlateEditor, Element, Transforms } from 'slate';
import generateNodeId from '@/lib/generateNodeId';

const withNodeId = (editor: SlateEditor) => {
    const { apply } = editor;
    editor.apply = (operation) => {
        if (operation.type === 'insert_node') {
            if (Element.isElement(operation.node)) {
                Transforms.setNodes(editor, { id: generateNodeId() });
            }
            return apply(operation);
        }

        if (operation.type === 'split_node') {
            Transforms.setNodes(editor, { id: generateNodeId() });
            return apply(operation);
        }
        return apply(operation);
    };

    return editor;
};

export default withNodeId;
