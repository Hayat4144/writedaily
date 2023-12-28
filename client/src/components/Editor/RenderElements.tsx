import {
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Paragraph,
} from '@/components/ui/typography';
import { RenderElementProps } from 'slate-react';

const RenderElement = ({
    children,
    attributes,
    element,
}: RenderElementProps) => {
    switch (element.type) {
        case 'paragraph':
            return <Paragraph {...attributes}>{children}</Paragraph>;
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

        default:
            return <Paragraph {...attributes}>{children}</Paragraph>;
    }
};

export default RenderElement;
