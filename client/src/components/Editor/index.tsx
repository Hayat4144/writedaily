'use client';
import { Fragment, useMemo } from 'react';
import { Descendant, createEditor } from 'slate';
import { Editable, RenderLeafProps, Slate, withReact } from 'slate-react';
import withNodeId from './Plugins/withNodeId';
import RenderElements from './RenderElements';
import generateNodeId from '@/lib/generateNodeId';

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
            { italic: true, text: 'is italic working?' },
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
        children: [{ text: 'Hello  is id working.' }],
    },
    {
        id: generateNodeId(),
        type: 'todo_list',
        checked: false,
        children: [{ text: 'This is todo list' }],
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

const renderLeafs = (props: RenderLeafProps) => {
    let { leaf, children, attributes } = props;
    if ('bold' in leaf && leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if ('italic' in leaf && leaf.italic) {
        children = <i>{children}</i>;
    }
    if ('underline' in leaf && leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

export default WriteDailyEditor;
