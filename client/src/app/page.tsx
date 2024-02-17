import WriteDailyEditor from '@/components/Editor';
import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import PublicNavbar from '@/components/Navbar/PublicNavbar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading1, Paragraph } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Fragment } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowDown } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
export default function Home() {
    return (
        <Fragment>
            <header>
                <PublicNavbar />
            </header>
            <main className="h-screen flex flex-col items-center">
                <div className="my-36 lg:mt-28 max-w-4xl mx-5 md:text-center">
                    <h1 className="text-6xl font-extrabold">
                        Discover the Power of Words
                    </h1>
                    <Paragraph className="my-6 md:px-5  lg:mx-5">
                        Welcome to our vibrant platform where words come alive
                        and conversations inspire. Join our community and
                        explore the boundless possibilities of dynamic
                        discourse.
                    </Paragraph>
                    <div className="flex items-center md:justify-center space-x-3 mt-4">
                        <Link href="/read" className={cn(buttonVariants())}>
                            Start reading
                        </Link>
                        <Link
                            href="/auth/signup"
                            className={cn(
                                buttonVariants({ variant: 'outline' }),
                            )}
                        >
                            Get started
                        </Link>
                    </div>
                </div>
                <div className="absolute left-[50%] bottom-5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="rounded-full animate-bounce"
                                    variant={'outline'}
                                    size={'icon'}
                                    asChild
                                >
                                    <a href="#about">
                                        <ArrowDown size={17} />
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Scroll</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </main>
            <section className="mx-5 grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                <Card className="bg-accent text-accent-foreground text-center">
                    <CardHeader>
                        <CardTitle>
                            Our WYSIWYG Editor Rocks Simple Markdown for
                            Effortless Writing!
                        </CardTitle>
                        <CardDescription className="text-[1rem] my-2">
                            Writing made easy! Enjoy the simplicity of
                            WriteDaily's editor powered by Slate.js, rocking
                            Markdown for tables, emoji, and an effortless
                            creative flow.
                        </CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
                <Card className="text-center bg-accent text-accent-foreground">
                    <CardHeader className="">
                        <CardTitle>All of these,completely free!</CardTitle>
                        <CardDescription className="my-2  text-[1rem]">
                            Join the thriving community of developer bloggeers
                            now.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="rounded-full space-x-1 
                            bg-green-700 font-extrabold justify-center
                            hover:bg-green-800
                            "
                        >
                            <Icons.check /> <span>FREE</span>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </Fragment>
    );
}
