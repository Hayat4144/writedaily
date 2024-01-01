import { Editor } from 'slate';

const withLink = (editor: Editor) => {
    const { isInline } = editor;

    editor.isInline = (element) =>
        ['link'].includes(element.type) || isInline(element);

    return editor;
};

export default withLink;