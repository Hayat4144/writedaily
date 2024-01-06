import { Editor } from 'slate';

const withImage = (editor: Editor) => {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
        return element.type === 'image' ? true : isVoid(element);
    };
    return editor;
};

export default withImage;
