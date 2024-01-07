import { ELEMENT_PARAGRAPH, headings } from '@/lib/constant';
import { Editor, Transforms } from 'slate';

const withHeading = (editor: Editor) => {
    const { insertBreak } = editor;

    editor.insertBreak = () => {
        const { selection } = editor;
        if (selection) {
            const [currentNode] = Editor.parent(editor, selection);
            const isHeadingblock = headings.includes((currentNode as any).type);
            if (!isHeadingblock) return insertBreak();
            insertBreak();
            Transforms.setNodes(editor, {
                type: ELEMENT_PARAGRAPH,
                children: [{ text: ' ' }],
            });
        } else {
            insertBreak();
        }
    };

    return editor;
};

export default withHeading;
