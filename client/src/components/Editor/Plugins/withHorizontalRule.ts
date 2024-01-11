import { Editor } from 'slate';

const withHorizontalRule = (editor: Editor) => {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
        return element.type === 'break' ? true : isVoid(element);
    };

    return editor;
};

export default withHorizontalRule;
