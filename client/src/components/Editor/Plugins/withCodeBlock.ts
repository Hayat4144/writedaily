import { ELEMENT_CODE_BLOCK } from '@/lib/constant';
import editorUtility from '@/lib/editorUtility';
import { Editor, Transforms } from 'slate';

const withCodeBlock = (editor: Editor) => {
    const { insertBreak } = editor;
    editor.insertBreak = () => {
        const isCodeBlock = editorUtility.isBlockActive(
            editor,
            ELEMENT_CODE_BLOCK,
        );
        if (isCodeBlock) {
            Transforms.insertText(editor, '\n');
        } else {
            insertBreak();
        }
    };

    return editor;
};

export default withCodeBlock;
