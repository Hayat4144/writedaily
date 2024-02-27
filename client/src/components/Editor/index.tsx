'use client';
import { Fragment, useMemo, useState } from 'react';
import { Descendant, Editor, Operation, Range, createEditor } from 'slate';
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
import CommandMenu from './CommandMenu';
import withHorizontalRule from './Plugins/withHorizontalRule';
import withInlines from './Plugins/withInlines';
import withConverterBlock from './Plugins/withConverterBlock';
import withTrailingBlock from './Plugins/withTrailingBlock';
import { withHTML } from './Plugins/withHtml';
import { updateArticle } from '@/externalapi/article';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { toast } from '../ui/use-toast';

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

const WriteDailyEditor = ({ data }: { data: any }) => {
    const session = useSession();
    const token = session.data?.user.AccessToken;
    const { id } = useParams();
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
        const isAstChange = editor.operations.some(
            (op: Operation) => 'set_selection' !== op.type,
        );

        if (isAstChange) {
            const data = {
                content: value,
            };
            if (!token || !id) return;
            const { error } = await updateArticle(token, data, id as string);
            if (error) return toast({ title: error, variant: 'destructive' });
        }
    };

    const editorValue = useMemo(() => data.content || initialValue, []);

    return (
        <Fragment>
            <Slate
                editor={editor}
                initialValue={editorValue}
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

                {isCommandMenu ? (
                    <CommandMenu
                        CommandMenuToggle={toggleCommandMenu}
                        isCommandMenu={isCommandMenu}
                    />
                ) : null}

                <Editable
                    onKeyDown={(event) =>
                        editorUtility.onkeydown(event, editor)
                    }
                    renderElement={RenderElements}
                    renderLeaf={renderLeafs}
                    className="my-5 mx-5 px-2 md:px-10 outline-none"
                    placeholder="Write something"
                ></Editable>
            </Slate>
        </Fragment>
    );
};

export default WriteDailyEditor;
