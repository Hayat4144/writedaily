'use client';
import { Fragment, useMemo } from 'react';
import { Descendant, createEditor } from 'slate';
import { Editable, RenderLeafProps, Slate, withReact } from 'slate-react';
import withNodeId from './Plugins/withNodeId';
import RenderElements from './RenderElements';

const initialValue: Descendant[] = [
    {
        id: '1',
        type: 'paragraph',
        children: [
            { text: 'we are her' },
            { italic: true, text: 'is italic working?' },
        ],
    },
    {
        id: '5',
        type: 'h1',
        children: [
            { text: "Let's check is it work not?" },
            { italic: true, text: 'is italic working?' },
        ],
    },
    {
        id: '98',
        type: 'h1',
        children: [{ text: "Let's check is it work not?" }],
    },
    {
        id: '98',
        type: 'h2',
        children: [{ text: "Let's check is it work not?" }],
    },
    {
        id: '98',
        type: 'h6',
        children: [{ text: "Let's check is it work not?" }],
    },

    {
        id: '2',
        type: 'paragraph',
        children: [
            { text: 'can you help me' },
            { text: 'is it bold?', bold: true },
        ],
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
