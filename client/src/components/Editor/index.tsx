'use client';
import { Fragment, useMemo, useState } from 'react';
import { Descendant, Editor, Range, createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import withNodeId from './Plugins/withNodeId';
import RenderElements from './RenderElements';
import renderLeafs from './RenderLeafs';
import FloatingToolbar from './Toolbar/FloatingToolbar';
import { initialValue } from '@/lib/constant';
import editorUtility from '@/lib/editorUtility';
import withLink from './Plugins/withLink';
import Linkpopover from './Linkpopover';
import FixedToolbar from './Toolbar/FixedToolbar';
import { withHistory } from 'slate-history';
import withImage from './Plugins/withImage';
import withMarkdown from './Plugins/withMarkdown';
import withCodeBlock from './Plugins/withCodeBlock';
import withHeading from './Plugins/withHeadings';
import { EmojiDetectProps } from '@/types';
import EmojiPicker from './EmojiPicker';

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
    withImage,
    withMarkdown,
    withCodeBlock,
    withHeading,
);

const WriteDailyEditor = () => {
    const editor = useMemo(() => createEditorWithPlugins(createEditor()), []);
    const [isLinkPopver, setIsLinkPopver] = useState<boolean>(false);

    const [emojistring, setemojistring] = useState<string>('');
    const [isEmojiOpen, setemojiToggle] = useState<boolean>(false);
    const [emojiTargetRange, setEmojiTargetRange] = useState<Range>();

    const emojiPatternProps: EmojiDetectProps = {
        editor: editor,
        setEmoji: setemojistring,
        setEmojiToggle: setemojiToggle,
        TargetRange: setEmojiTargetRange,
    };

    const changeHandler = (value: Descendant[]) => {
        const { selection } = editor;
        editorUtility.detectEmoji(emojiPatternProps);
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
                {isEmojiOpen ? (
                    <EmojiPicker
                        searchString={emojistring}
                        emojiRange={emojiTargetRange}
                        changeEmojiRange={setEmojiTargetRange}
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
