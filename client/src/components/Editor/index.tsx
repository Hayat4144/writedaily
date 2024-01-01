'use client';
import { Fragment, useMemo } from 'react';
import { Editor, createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import withNodeId from './Plugins/withNodeId';
import RenderElements from './RenderElements';
import renderLeafs from './RenderLeafs';
import MarksComp from './Toolbar/Marks';
import FloatingToolbar from './Toolbar/FloatingToolbar';
import { initialValue } from '@/lib/constant';
import editorUtility from '@/lib/editorUtility';
import withLink from './Plugins/withLink';

type SlatePlugin = (editor: Editor) => Editor;

const pipe =
    (...plugins: SlatePlugin[]) =>
    (editor: Editor) => {
        plugins.forEach((plugin) => {
            editor = plugin(editor);
        });
        return editor;
    };

const createEditorWithPlugins = pipe(withReact, withNodeId, withLink);

const WriteDailyEditor = () => {
    const editor = useMemo(() => createEditorWithPlugins(createEditor()), []);

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
                    onKeyDown={(event) =>
                        editorUtility.onkeydown(event, editor)
                    }
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
