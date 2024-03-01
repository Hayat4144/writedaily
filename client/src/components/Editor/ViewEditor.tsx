'use client';
import React, { useEffect, useMemo } from 'react';
import { Descendant, Node, createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import RenderElement from './RenderElements';
import renderLeafs from './RenderLeafs';
import pako from 'pako';

interface ViewEditorProps {
    content: Descendant[];
}

export default function ViewEditor({ content }: ViewEditorProps) {
    const editor = useMemo(() => withReact(createEditor()), []);

    const serialize = (nodes: Descendant[]) => {
        return nodes.map((node) => Node.string(node)).join('\n');
    };

    return (
        <Slate initialValue={content} editor={editor}>
            <audio controls className="my-2">
                <source></source>
            </audio>
            <Editable
                renderElement={RenderElement}
                renderLeaf={renderLeafs}
                className="my-5"
                readOnly
            />
        </Slate>
    );
}
