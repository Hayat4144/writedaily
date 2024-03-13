'use client';
import React, { useMemo, useState } from 'react';
import { Descendant, Editor, createEditor, Range } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import RenderElement from './RenderElements';
import renderLeafs from './RenderLeafs';
import { withHistory } from 'slate-history';
import withNodeId from './Plugins/withNodeId';
import withLink from './Plugins/withLink';
import withImage from './Plugins/withImage';
import withMarkdown from './Plugins/withMarkdown';
import withCodeBlock from './Plugins/withCodeBlock';
import withHeading from './Plugins/withHeadings';
import withHorizontalRule from './Plugins/withHorizontalRule';
import withInlines from './Plugins/withInlines';
import withConverterBlock from './Plugins/withConverterBlock';
import { withHTML } from './Plugins/withHtml';
import withTrailingBlock from './Plugins/withTrailingBlock';
import { initialValue } from '@/lib/constant';
import FixedToolbar from './Toolbar/FixedToolbar';
import FloatingToolbar from './Toolbar/FloatingToolbar';
import { EmojiDetectProps } from '@/types';
import Linkpopover from './Linkpopover';
import EmojiPicker from './EmojiPicker';
import CommandMenu from './CommandMenu';
import editorUtility from '@/lib/editorUtility';

interface ViewEditorProps {
    content: Descendant[];
}

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
    withHorizontalRule,
    withInlines,
    withConverterBlock,
    withTrailingBlock,
    withHTML,
);

export default function TryEditor() {
    const editor = useMemo(() => createEditorWithPlugins(createEditor()), []);
    const [isLinkPopver, setIsLinkPopver] = useState<boolean>(false);
    const [isCommandMenu, toggleCommandMenu] = useState<boolean>(false);
    const [emojistring, setemojistring] = useState<string>('');
    const [isEmojiOpen, setemojiToggle] = useState<boolean>(false);
    const [emojiTargetRange, setEmojiTargetRange] = useState<Range>();

    const emojiPatternProps: EmojiDetectProps = {
        editor: editor,
        setEmoji: setemojistring,
        setEmojiToggle: setemojiToggle,
        TargetRange: setEmojiTargetRange,
    };

    const changeHandler = async (value: Descendant[]) => {
        const { selection } = editor;

        editorUtility.detectEmoji(emojiPatternProps);
        editorUtility.detectCommandMenu(editor, toggleCommandMenu);
        editorUtility.identifyLink(editor);
        if (selection && editorUtility.isBlockActive(editor, 'link')) {
            setIsLinkPopver(true);
        }

        editorUtility.detectEmoji(emojiPatternProps);
    };

    const editorValue = useMemo(() => initialValue, []);

    return (
        <Slate
            initialValue={editorValue}
            onChange={changeHandler}
            editor={editor}
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

            {isCommandMenu ? (
                <CommandMenu
                    CommandMenuToggle={toggleCommandMenu}
                    isCommandMenu={isCommandMenu}
                />
            ) : null}

            <Editable
                onKeyDown={(event) => editorUtility.onkeydown(event, editor)}
                renderElement={RenderElement}
                renderLeaf={renderLeafs}
                className="my-5 mx-5 px-2 md:px-10 outline-none min-h-screen"
            />
        </Slate>
    );
}
