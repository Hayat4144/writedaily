import { BaseEditor, Element, BaseRange, BaseElement, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_CODE_LINE,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_LI,
    ELEMENT_LINK,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TODO_LIST,
    ELEMENT_UL,
} from '@/lib/constant';

export type EmptyText = {
    text: string;
};

export type RichText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    kbd?: boolean;
    subscript?: boolean;
    superscript?: boolean;
    highlight?: React.CSSProperties['backgroundColor'];
    fontFamily?: React.CSSProperties['fontFamily'];
    color?: React.CSSProperties['color'];
    fontSize?: React.CSSProperties['fontSize'];
    fontWeight?: React.CSSProperties['fontWeight'];
};

export interface MyIndentProps {
    indent?: number;
}

export interface MyIndentListProps extends MyIndentProps {
    listStart?: number;
    listRestart?: number;
    listStyleType?: string;
}

export interface MyLineHeightProps {
    lineHeight?: React.CSSProperties['lineHeight'];
}

export interface MyAlignProps {
    align?: React.CSSProperties['textAlign'];
}
export interface MyBaseElement extends BaseElement {
    id: string;
}

export interface MyBlockElement
    extends MyBaseElement,
        MyIndentListProps,
        MyLineHeightProps {}

export interface MyParagraphElement extends MyBlockElement {
    type: typeof ELEMENT_PARAGRAPH;
}

export interface MyH1Element extends MyBlockElement {
    type: typeof ELEMENT_H1;
}
export interface MyH2Element extends MyBlockElement {
    type: typeof ELEMENT_H2;
}

export interface MyH3Element extends MyBlockElement {
    type: typeof ELEMENT_H3;
}

export interface MyH4Element extends MyBlockElement {
    type: typeof ELEMENT_H4;
}

export interface MyH5Element extends MyBlockElement {
    type: typeof ELEMENT_H5;
}

export interface MyH6Element extends MyBlockElement {
    type: typeof ELEMENT_H6;
}

export interface MyQuoteBlockElement extends MyBlockElement {
    type: typeof ELEMENT_BLOCKQUOTE;
}

export interface MyCodeLineELement {
    type: typeof ELEMENT_CODE_LINE;
    children: EmptyText[];
}

export interface MyCodeBlockELement {
    type: typeof ELEMENT_CODE_BLOCK;
    children: MyCodeLineELement[];
}

export interface MyImageELement {
    type: typeof ELEMENT_CODE_BLOCK;
    children: EmptyText[];
}
export interface MyLinkElement extends BaseElement {
    type: typeof ELEMENT_LINK;
}

export interface MyBulletedListElement extends MyBlockElement {
    type: typeof ELEMENT_UL;
    children: MyListItemElement[];
}

export interface MyNumberListElement extends MyBlockElement {
    type: typeof ELEMENT_OL;
    children: MyListItemElement[];
}

export interface MyListItemElement extends MyBlockElement {
    type: typeof ELEMENT_LI;
}

export interface MyTodoItemElent extends MyBlockElement {
    type: typeof ELEMENT_TODO_LIST;
    checked: boolean;
}

export type MyCustomElement =
    | MyTodoItemElent
    | MyParagraphElement
    | MyH1Element
    | MyH2Element
    | MyH3Element
    | MyH4Element
    | MyH5Element
    | MyH6Element
    | MyCodeBlockELement
    | MyCodeLineELement
    | MyImageELement
    | MyLinkElement
    | MyListItemElement
    | MyNumberListElement
    | MyBulletedListElement
    | MyQuoteBlockElement;

export type CustomEditor = BaseEditor &
    ReactEditor &
    HistoryEditor & {
        nodeToDecorations?: Map<Element, Range[]>;
    };

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor;
        Element: MyCustomElement;
        Text: RichText | EmptyText;
        Range: BaseRange & {
            [key: string]: unknown;
        };
    }
}
