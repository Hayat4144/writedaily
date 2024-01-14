import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_BREAK,
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

export function hasOnlyOneProperty(obj: Record<string, any>): boolean {
    const keys = Object.keys(obj);
    return keys.length === 1;
}

export const ValidateList = (children: any[]) => {
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
        } else {
            newChildren.push(child);
        }
    });
    return newChildren;
};

export const RemoveBreakLineCharacter = (element: any[]) => {
    const m = element.filter(
        (item) => !item.hasOwnProperty('text') && item.text !== '\n',
    );
    return m.filter((item) => !item.null || !item.undefined);
};

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
    HR: () => ({ type: ELEMENT_BREAK }),
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

const HTMLDesirializer = (el: HTMLElement) => {
    if (el.nodeType === Node.TEXT_NODE) {
        return jsx('text', {}, el.textContent);
    } else if (el.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    let children: any[] = Array.from(el.childNodes)
        .map((node: any) => HTMLDesirializer(node))
        .flat();

    if (children.length === 0) {
        children = [{ text: '' }];
    }

    if (ELEMENT_TAGS[el.nodeName as keyof typeof ELEMENT_TAGS]) {
        const attrs =
            ELEMENT_TAGS[el.nodeName as keyof typeof ELEMENT_TAGS](el);
        if (attrs.type === ELEMENT_OL || attrs.type === ELEMENT_UL) {
            const filtered = RemoveBreakLineCharacter(children);
            return jsx('element', attrs, filtered);
        }
        if (attrs.type === ELEMENT_LI) {
            const validList = ValidateList(children);
            return jsx('element', attrs, validList);
        }
        return jsx('element', attrs, children);
    }
    if (TEXT_TAGS[el.nodeName as keyof typeof TEXT_TAGS]) {
        const attrs = TEXT_TAGS[el.nodeName as keyof typeof TEXT_TAGS]();
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
            console.log(fragment);
            Transforms.insertFragment(editor, fragment as any);
            return;
        }
        insertData(data);
    };

    return editor;
};
