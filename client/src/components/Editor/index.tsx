'use client';
import { Fragment, useMemo } from 'react';
import { Descendant, createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import withNodeId from './Plugins/withNodeId';
import RenderElements from './RenderElements';
import generateNodeId from '@/lib/generateNodeId';
import renderLeafs from './RenderLeafs';

const initialValue: Descendant[] = [
    {
        id: generateNodeId(),
        type: 'blockquote',
        children: [{ text: 'The magic you find , the work you avoid.' }],
    },
    {
        id: generateNodeId(),
        type: 'number_list',
        children: [
            {
                type: 'list',
                children: [{ text: 'Is it Number list?' }],
                id: generateNodeId(),
            },
        ],
    },

    {
        id: generateNodeId(),
        type: 'paragraph',
        children: [
            { text: 'we are her' },
            {
                italic: true,
                text: 'is italic working?',
                highlight: 'red',
                fontSize: '40px',
            },
        ],
    },
    {
        id: generateNodeId(),
        type: 'bulleted_list',
        children: [
            {
                type: 'list',
                children: [{ text: 'Is it list?' }],
                id: generateNodeId(),
            },
        ],
    },
    {
        id: generateNodeId(),
        type: 'paragraph',
        children: [
            { text: 'Hello  is id working.' },
            {
                type: 'code_line',
                children: [
                    { text: 'The magic you find , the work you avoid.' },
                ],
            },
            {
                text: 'is color is working perfectly',
                color: 'yellow',
            },
            {
                text: 'is superscript leaf is working perfectly',
                superscript: true,
            },
            {
                text: 'hello fontFamily',
                fontFamily: 'monospace',
            },
        ],
    },
    {
        id: generateNodeId(),
        type: 'todo_list',
        checked: false,
        children: [{ text: 'This is todo list', fontWeight: 'bolder' }],
    },
    {
        id: generateNodeId(),
        type: 'h1',
        children: [{ text: "Let's check is it work not?" }],
    },
];

const WriteDailyEditor = () => {
    const editor = useMemo(() => withReact(withNodeId(createEditor())), []);
    return (
        <Fragment>
            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={(value) => {
                    console.log(value);
                }}
            >
                <Editable
                    renderElement={RenderElements}
                    renderLeaf={renderLeafs}
                    className="my-5 mx-5 px-2 outline-none"
                    placeholder="Write something"
                ></Editable>
            </Slate>
        </Fragment>
    );
};

export default WriteDailyEditor;
