'use client';
import { Fragment, useMemo } from 'react';
import { Descendant, createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import withNodeId from './Plugins/withNodeId';
import RenderElements from './RenderElements';
import generateNodeId from '@/lib/generateNodeId';
import renderLeafs from './RenderLeafs';
import MarksComp from './Toolbar/Marks';
import FloatingToolbar from './Toolbar/FloatingToolbar';
import { initialValue } from '@/lib/constant';

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
                <FloatingToolbar />
                <MarksComp />
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
