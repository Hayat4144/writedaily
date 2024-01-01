'use client';
import { Fragment, useMemo, useState } from 'react';
import { Descendant, Editor, createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import withNodeId from './Plugins/withNodeId';
import RenderElements from './RenderElements';
import renderLeafs from './RenderLeafs';
import MarksComp from './Toolbar/Marks';
import FloatingToolbar from './Toolbar/FloatingToolbar';
import { initialValue } from '@/lib/constant';
import editorUtility from '@/lib/editorUtility';
import withLink from './Plugins/withLink';
import Linkpopover from './Linkpopover';
import FixedToolbar from './Toolbar/FixedToolbar';
import { withHistory } from 'slate-history';

type SlatePlugin = (editor: Editor) => Editor;

const pipe =
    (...plugins: SlatePlugin[]) =>
    (editor: Editor) => {
        plugins.forEach((plugin) => {
            editor = plugin(editor);
        });
        return editor;
    };

const createEditorWithPlugins = pipe(
    withReact,
    withHistory,
    withNodeId,
    withLink,
);

const WriteDailyEditor = () => {
    const editor = useMemo(() => createEditorWithPlugins(createEditor()), []);
    const [isLinkPopver, setIsLinkPopver] = useState<boolean>(false);

    const changeHandler = (value: Descendant[]) => {
        const { selection } = editor;
        if (selection && editorUtility.isBlockActive(editor, 'link')) {
            setIsLinkPopver(true);
        }
    };

    return (
        <Fragment>
            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={changeHandler}
            >
                <FixedToolbar />
                <FloatingToolbar />
                {isLinkPopver ? (
                    <Linkpopover
                        isLinkPopver={isLinkPopver}
                        linkPopoverToggle={setIsLinkPopver}
                    />
                ) : null}

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