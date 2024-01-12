import {
    BlockQuote,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    InlineCode,
    ListItem,
    Paragraph,
} from '@/components/ui/typography';
import { RenderElementProps, useSelected, useSlate } from 'slate-react';
import TodoBlockElement from './Blocks/TodoBlock';
import BulletedList from './Blocks/BulletedList';
import NumberList from './Blocks/NumberList';
import LinkBlock from './Blocks/LinkBlock';
import ImageBlock from './Blocks/ImageBlock';
import HorizontalRuleBlock from './Blocks/HorizontalRuleBlock';
import { Node, Range } from 'slate';

const RenderElement = ({
    children,
    attributes,
    element,
}: RenderElementProps) => {
    const style: React.CSSProperties = { textAlign: (element as any).align };
    const selected = useSelected();
    const editor = useSlate();
    const { selection } = editor;
    const isCollapased = selection && Range.isCollapsed(selection);
    const isEmpty =
        Node.string(element).trim() === '' && element.children.length === 1;
    switch (element.type) {
        case 'paragraph':
            return (
                <Paragraph
                    {...attributes}
                    {...element}
                    style={style}
                    className={`${
                        selected && isCollapased && isEmpty
                            ? 'selected-empty-element'
                            : ''
                    }`}
                >
                    {children}
                </Paragraph>
            );
        case 'h1':
            return (
                <Heading1
                    {...attributes}
                    style={style}
                    className={`${
                        selected && isCollapased && isEmpty
                            ? 'selected-empty-element'
                            : ''
                    }`}
                >
                    {children}
                </Heading1>
            );
        case 'h2':
            return (
                <Heading2
                    {...attributes}
                    style={style}
                    className={`${
                        selected && isCollapased && isEmpty
                            ? 'selected-empty-element'
                            : ''
                    }`}
                >
                    {children}
                </Heading2>
            );
        case 'h3':
            return (
                <Heading3
                    {...attributes}
                    style={style}
                    className={`${
                        selected && isCollapased && isEmpty
                            ? 'selected-empty-element'
                            : ''
                    }`}
                >
                    {children}
                </Heading3>
            );
        case 'h4':
            return (
                <Heading4
                    {...attributes}
                    style={style}
                    className={`${
                        selected && isCollapased && isEmpty
                            ? 'selected-empty-element'
                            : ''
                    }`}
                >
                    {children}
                </Heading4>
            );
        case 'h5':
            return (
                <Heading5
                    {...attributes}
                    style={style}
                    className={`${
                        selected && isCollapased && isEmpty
                            ? 'selected-empty-element'
                            : ''
                    }`}
                >
                    {children}
                </Heading5>
            );
        case 'h6':
            return (
                <Heading6
                    {...attributes}
                    style={style}
                    className={`${
                        selected && isCollapased && isEmpty
                            ? 'selected-empty-element'
                            : ''
                    }`}
                >
                    {children}
                </Heading6>
            );
        case 'blockquote':
            return (
                <BlockQuote {...attributes} {...element} style={style}>
                    {children}
                </BlockQuote>
            );
        case 'bulleted_list':
            return (
                <BulletedList {...attributes} {...element} style={style}>
                    {children}
                </BulletedList>
            );
        case 'list':
            return (
                <ListItem {...attributes} {...element} style={style}>
                    {children}
                </ListItem>
            );
        case 'number_list':
            return (
                <NumberList {...attributes} {...element} style={style}>
                    {children}
                </NumberList>
            );

        case 'todo_list':
            return (
                <TodoBlockElement
                    element={element}
                    children={children}
                    attributes={attributes}
                />
            );
        case 'code_line':
            return (
                <InlineCode {...attributes} {...element} style={style}>
                    {children}
                </InlineCode>
            );

        case 'link':
            return (
                <LinkBlock
                    element={element}
                    attributes={attributes}
                    children={children}
                />
            );
        case 'break':
            return (
                <HorizontalRuleBlock
                    attributes={attributes}
                    children={children}
                    element={element}
                />
            );
        case 'image':
            return (
                <ImageBlock
                    attributes={attributes}
                    element={element}
                    children={children}
                />
            );
        default:
            return <Paragraph {...attributes}>{children}</Paragraph>;
    }
};

export default RenderElement;
