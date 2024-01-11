import {
    BaseEditor,
    Element,
    BaseRange,
    BaseElement,
    Descendant,
    Editor,
    Range,
} from 'slate';
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
    ELEMENT_IMAGE,
    ELEMENT_BREAK,
} from '@/lib/constant';

export type componentType = 'link' | 'image';

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

export type AlignType = 'right' | 'justify' | 'left' | 'center';

export interface MyBlockElement
    extends MyBaseElement,
        MyIndentListProps,
        MyLineHeightProps {
    align?: AlignType;
}

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

export interface MyLinkElement {
    type: typeof ELEMENT_LINK;
    url: string;
    children: Descendant[];
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

export interface MyBrElement {
    id: string;
    type: typeof ELEMENT_BREAK;
    children: [EmptyText];
}

export interface MyImageELement {
    id: string;
    type: typeof ELEMENT_IMAGE;
    url: string;
    caption?: string;
    children: [EmptyText];
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
    | MyQuoteBlockElement
    | MyBrElement;

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

export interface Marks {
    id: string;
    icon: React.ReactNode;
    mark: string;
    shortcut?: string;
}

export interface EmojiDetectProps {
    editor: CustomEditor;
    setEmoji: (value: string) => void;
    setEmojiToggle: (value: boolean) => void;
    TargetRange: (value: Range | undefined) => void;
}
