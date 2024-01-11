import { Descendant } from 'slate';
import generateNodeId from './generateNodeId';

export const ELEMENT_H1 = 'h1';
export const ELEMENT_H2 = 'h2';
export const ELEMENT_H3 = 'h3';
export const ELEMENT_H4 = 'h4';
export const ELEMENT_H5 = 'h5';
export const ELEMENT_H6 = 'h6';
export const ELEMENT_BLOCKQUOTE = 'blockquote';
export const ELEMENT_CODE_BLOCK = 'code_block';
export const ELEMENT_CODE_LINE = 'code_line';
export const ELEMENT_CODE_SYNTAX = 'code_syntax';
export const ELEMENT_IMAGE = 'image';
export const ELEMENT_LINK = 'link';
export const ELEMENT_TODO_LIST = 'todo_list';
export const ELEMENT_UL = 'bulleted_list';
export const ELEMENT_OL = 'number_list';
export const ELEMENT_LI = 'list';
export const ELEMENT_PARAGRAPH = 'paragraph';
export const ELEMENT_BREAK = 'break';

export const headings = [
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
];

export const initialValue: Descendant[] = [
    // {
    //     id: generateNodeId(),
    //     type: 'image',
    //     url: 'https://source.unsplash.com/kFrdX5IeQzI',
    //     caption: 'Hayat github pic',
    //     children: [{ text: '' }],
    // },
    // {
    //     id: generateNodeId(),
    //     type: 'blockquote',
    //     children: [{ text: 'The magic you find , the work you avoid.' }],
    // },
    // {
    //     id: generateNodeId(),
    //     type: 'number_list',
    //     children: [
    //         {
    //             type: 'list',
    //             children: [{ text: 'Is it Number list?' }],
    //             id: generateNodeId(),
    //         },
    //     ],
    // },
    //
    // {
    //     id: generateNodeId(),
    //     type: 'paragraph',
    //     children: [
    //         { text: 'hello is link working' },
    //         {
    //             type: 'link',
    //             url: 'http://google.com',
    //             children: [{ text: ' click here' }],
    //         },
    //         {
    //             italic: true,
    //             text: 'is italic working?',
    //             highlight: 'red',
    //             fontSize: '40px',
    //         },
    //     ],
    // },
    // {
    //     id: generateNodeId(),
    //     type: 'bulleted_list',
    //     children: [
    //         {
    //             type: 'list',
    //             children: [{ text: 'Is it list?' }],
    //             id: generateNodeId(),
    //         },
    //     ],
    // },
    // {
    //     id: generateNodeId(),
    //     type: 'paragraph',
    //     children: [
    //         { text: 'Hello  is id working.' },
    //         {
    //             type: 'code_line',
    //             children: [
    //                 { text: 'The magic you find , the work you avoid.' },
    //             ],
    //         },
    //         {
    //             text: 'is color is working perfectly',
    //             color: 'yellow',
    //         },
    //         {
    //             text: 'is superscript leaf is working perfectly',
    //             superscript: true,
    //         },
    //         {
    //             text: 'hello fontFamily',
    //             fontFamily: 'monospace',
    //         },
    //     ],
    // },
    // {
    //     id: generateNodeId(),
    //     type: 'todo_list',
    //     checked: false,
    //     children: [{ text: 'This is todo list', fontWeight: 'bolder' }],
    // },
    {
        id: generateNodeId(),
        type: 'h1',
        children: [{ text: "Let's check is it work not?" }],
    },
    {
        id: generateNodeId(),
        type: 'break',
        children: [{ text: '' }],
    },
    {
        id: generateNodeId(),
        type: 'h4',
        children: [{ text: "Let's check is it work not?" }],
    },
];
