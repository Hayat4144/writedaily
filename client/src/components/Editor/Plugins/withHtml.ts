import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_IMAGE,
    ELEMENT_LI,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_UL,
} from '@/lib/constant';
import { Editor, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';

function hasOnlyOneProperty(obj: Record<string, any>): boolean {
    const keys = Object.keys(obj);
    return keys.length === 1;
}

const ELEMENT_TAGS = {
    A: (el: HTMLElement) => ({ type: 'link', url: el.getAttribute('href') }),
    BLOCKQUOTE: () => ({ type: ELEMENT_BLOCKQUOTE }),
    H1: () => ({ type: ELEMENT_H1 }),
    H2: () => ({ type: ELEMENT_H2 }),
    H3: () => ({ type: ELEMENT_H3 }),
    H4: () => ({ type: ELEMENT_H4 }),
    H5: () => ({ type: ELEMENT_H5 }),
    H6: () => ({ type: ELEMENT_H6 }),
    IMG: (el: HTMLElement) => ({
        type: ELEMENT_IMAGE,
        url: el.getAttribute('src'),
    }),
    UL: () => ({ type: ELEMENT_UL }),
    OL: () => ({ type: ELEMENT_OL }),
    LI: () => ({ type: ELEMENT_LI }),
    P: () => ({ type: ELEMENT_PARAGRAPH }),
    PRE: () => ({ type: ELEMENT_CODE_BLOCK }),
};

const TEXT_TAGS = {
    CODE: () => ({ code: true }),
    DEL: () => ({ strikethrough: true }),
    EM: () => ({ italic: true }),
    I: () => ({ italic: true }),
    S: () => ({ strikethrough: true }),
    STRONG: () => ({ bold: true }),
    U: () => ({ underline: true }),
};

export const HTMLDesirializer = (el: HTMLElement) => {
    if (el.nodeType === 3) {
        return el.textContent;
    }

    if (el.nodeType !== 1) {
        return null;
    }
    const { nodeName } = el;
    let parent = el;

    if (
        nodeName === 'PRE' &&
        el.childNodes[0] &&
        el.childNodes[0].nodeName === 'CODE'
    ) {
        parent = el.childNodes[0] as any;
    }
    let children = Array.from(parent.childNodes)
        .map(HTMLDesirializer as any)
        .flat();

    if (children.length === 0) {
        children = [{ text: '' }];
    }

    if (el.nodeName === 'BODY') {
        return jsx('fragment', {}, children);
    }

    if (ELEMENT_TAGS[nodeName as keyof typeof ELEMENT_TAGS]) {
        const attrs = ELEMENT_TAGS[nodeName as keyof typeof ELEMENT_TAGS](el);

        if (attrs.type === ELEMENT_LI) {
            let newChildren: any[] = [];
            children.map((child: any) => {
                if ((child as Object).hasOwnProperty('type')) {
                    child.children.flatMap((newChild: any) => {
                        if (hasOnlyOneProperty(newChild)) {
                            newChildren.push(newChild.text);
                        } else {
                            newChildren.push(newChild);
                        }
                    });
                }
            });

            return jsx('element', attrs, newChildren);
        } else {
            return jsx('element', attrs, children);
        }
    }

    if (TEXT_TAGS[nodeName as keyof typeof TEXT_TAGS]) {
        const attrs = TEXT_TAGS[nodeName as keyof typeof TEXT_TAGS]();
        return children.map((child) => jsx('text', attrs, child));
    }
    return children;
};

export const withHTML = (editor: Editor) => {
    const { insertData } = editor;

    editor.insertData = (data) => {
        const html = data.getData('text/html');

        if (html) {
            const parse = new DOMParser().parseFromString(html, 'text/html');
            const fragment = HTMLDesirializer(parse.body);
            Transforms.insertFragment(editor, fragment as any);
            return;
        }
        insertData(data);
    };

    return editor;
};
