import React, {
    FormEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import Portal from '../Portal';
import { ReactEditor, useSlate } from 'slate-react';
import editorUtility from '@/lib/editorUtility';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { toast } from 'sonner';

interface LinkPopoverProps {
    isLinkPopver: boolean;
    linkPopoverToggle: (value: boolean) => void;
}

function Linkpopover({ isLinkPopver, linkPopoverToggle }: LinkPopoverProps) {
    const linkRef = useRef<HTMLDivElement>(null);
    const editor = useSlate();
    const [linkCopied, setLinkCopied] = useState(false);
    const [linkUrl, setlinkUrl] = useState('');

    const actionHandler = useCallback(
        (e: KeyboardEvent | MouseEvent) => {
            if (isLinkPopver && !linkRef.current?.contains(e.target)) {
                linkPopoverToggle(false);
            }
        },
        [linkRef, isLinkPopver],
    );

    useEffect(() => {
        document.addEventListener('mousedown', actionHandler);
        document.addEventListener('keydown', actionHandler);
        return () => {
            document.removeEventListener('mousedown', actionHandler);
            document.removeEventListener('keydown', actionHandler);
        };
    }, [actionHandler]);

    useEffect(() => {
        const { selection } = editor;
        const el = linkRef.current;

        if (!el || !selection || !isLinkPopver) {
            el?.removeAttribute('style');
            return;
        }

        const domRange = ReactEditor.toDOMRange(editor, selection);
        const [link] = editorUtility.getBlock(editor, 'link');

        setlinkUrl((link as any).url);
        const rect = domRange.getBoundingClientRect();
        const CARET_TOP_OFFSET = 15;
        el.style.opacity = '1';
        el.style.top = `${
            rect.top + rect.height + window.pageYOffset + CARET_TOP_OFFSET
        }px`;
        let calPos = rect.left - el.offsetWidth / 2;

        el.style.left = `${calPos}px`;
    }, [isLinkPopver, editor]);

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        editorUtility.updateLink(editor, linkUrl);
        linkPopoverToggle(false);
        toast('Link has been updated successfully.', {
            description: `Your link is changed to ${linkUrl}`,
            action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
            },
        });
    };

    const removeLink = () => {
        editorUtility.unwrapNodes(editor, 'link');
        linkPopoverToggle(false);
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(linkUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
    };

    return (
        <Portal>
            <div
                ref={linkRef}
                className="absolute opacity-0 -left-[10000px] -top-[10000px]"
            >
                <Card className="w-fit">
                    <CardContent className="px-3 py-3 mx-2">
                        <form onSubmit={handleFormSubmit}>
                            <div className="grid grid-cols-1 gap-4 w-64">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="link">Link</Label>
                                    <Input
                                        id="link"
                                        placeholder="Enter your link"
                                        value={linkUrl}
                                        type="text"
                                        onChange={(e) =>
                                            setlinkUrl(e.target.value)
                                        }
                                    />
                                </div>
                                <Button>Submit</Button>
                            </div>
                        </form>

                        <div className="my-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size={'icon'}
                                            variant={'ghost'}
                                            onClick={copyLink}
                                        >
                                            {linkCopied ? (
                                                <Icons.copyCheck
                                                    size={17}
                                                    className="text-green-700"
                                                />
                                            ) : (
                                                <Icons.copy size={17} />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Copy link</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size={'icon'}
                                            variant={'ghost'}
                                            onClick={removeLink}
                                        >
                                            <Icons.trash
                                                size={16}
                                                className="text-red-600 hover:text-red-700"
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete link</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size={'icon'}
                                            variant={'ghost'}
                                            onClick={() =>
                                                window.open(linkUrl, '_blank')
                                            }
                                        >
                                            <Icons.externalLink size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Open link in new tab
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Portal>
    );
}

export default Linkpopover;
