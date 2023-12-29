import React from 'react';
import { cn } from '@/lib/utils';

interface ListProps extends React.HTMLAttributes<HTMLLIElement> {}
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface InlineCodeProps extends React.HTMLAttributes<HTMLPreElement> {}
interface BlockquoteProps extends React.HtmlHTMLAttributes<HTMLQuoteElement> {}

const InlineCode = React.forwardRef<HTMLPreElement, InlineCodeProps>(
    ({ className, ...props }, ref) => {
        return (
            <code
                ref={ref}
                className={cn(
                    'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
                    className,
                )}
                {...props}
            />
        );
    },
);

const BlockQuote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
    ({ className, ...props }, ref) => {
        return (
            <blockquote
                ref={ref}
                className={cn('border-l-2 pl-6 my-3 italic', className)}
                {...props}
            />
        );
    },
);

const ListItem = React.forwardRef<HTMLLIElement, ListProps>(
    ({ className, ...props }, ref) => {
        return <li className={cn('', className)} ref={ref} {...props} />;
    },
);

const Paragraph = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('leading-7', className)} {...props} />
));

Paragraph.displayName = 'Paragraph';

const Heading1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h1
                ref={ref}
                className={cn(
                    'scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-5xl',
                    className,
                )}
                {...props}
            />
        );
    },
);
const Heading2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h2
                ref={ref}
                className={cn(
                    'scroll-m-20 text-4xl font-semibold tracking-tight',
                    className,
                )}
                {...props}
            />
        );
    },
);
const Heading3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    'scroll-m-20 text-3xl font-semibold tracking-tight',
                    className,
                )}
                {...props}
            />
        );
    },
);
const Heading4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h4
                ref={ref}
                className={cn(
                    'scroll-m-20 text-2xl font-semibold tracking-tight',
                    className,
                )}
                {...props}
            />
        );
    },
);
const Heading5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h1
                ref={ref}
                className={cn('scroll-m-20 tracking-tight text-xl', className)}
                {...props}
            />
        );
    },
);
const Heading6 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, ...props }, ref) => {
        return (
            <h6
                ref={ref}
                className={cn(
                    'scroll-m-20 tracking-tight text-base',
                    className,
                )}
                {...props}
            />
        );
    },
);

export {
    InlineCode,
    ListItem,
    BlockQuote,
    Paragraph,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
};
