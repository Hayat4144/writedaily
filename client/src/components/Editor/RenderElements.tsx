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
import { RenderElementProps } from 'slate-react';
import TodoBlockElement from './Blocks/TodoBlock';
import BulletedList from './Blocks/BulletedList';
import NumberList from './Blocks/NumberList';
import LinkBlock from './Blocks/LinkBlock';

const RenderElement = ({
    children,
    attributes,
    element,
}: RenderElementProps) => {
    switch (element.type) {
        case 'paragraph':
            return (
                <Paragraph {...attributes} {...element}>
                    {children}
                </Paragraph>
            );
        case 'h1':
            return <Heading1 {...attributes}>{children}</Heading1>;
        case 'h2':
            return <Heading2 {...attributes}>{children}</Heading2>;
        case 'h3':
            return <Heading3 {...attributes}>{children}</Heading3>;
        case 'h4':
            return <Heading4 {...attributes}>{children}</Heading4>;
        case 'h5':
            return <Heading5 {...attributes}>{children}</Heading5>;
        case 'h6':
            return <Heading6 {...attributes}>{children}</Heading6>;
        case 'blockquote':
            return (
                <BlockQuote {...attributes} {...element}>
                    {children}
                </BlockQuote>
            );
        case 'bulleted_list':
            return (
                <BulletedList {...attributes} {...element}>
                    {children}
                </BulletedList>
            );
        case 'list':
            return (
                <ListItem {...attributes} {...element}>
                    {children}
                </ListItem>
            );
        case 'number_list':
            return (
                <NumberList {...attributes} {...element}>
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
                <InlineCode {...attributes} {...element}>
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
        default:
            return <Paragraph {...attributes}>{children}</Paragraph>;
    }
};

export default RenderElement;
