import { ELEMENT_CODE_LINE, ELEMENT_LINK } from '@/lib/constant';
import { Editor } from 'slate';

const withInlines = (editor: Editor) => {
    const { isInline } = editor;

    editor.isInline = (element) =>
        [ELEMENT_LINK, ELEMENT_CODE_LINE].includes(element.type) ||
        isInline(element);

    return editor;
};

export default withInlines;
