import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

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
    Paragraph,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
};
