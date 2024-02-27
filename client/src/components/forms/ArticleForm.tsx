import { useSession } from 'next-auth/react';
import { Fragment, useState } from 'react';
import { toast } from '../ui/use-toast';
import { createArticle } from '@/externalapi/article';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

export function ArticleForm({ className }: React.ComponentProps<'form'>) {
    const session = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    const submitHandler = async () => {
        const token = session.data?.user.AccessToken as string;
        if (!token) return;
        setIsLoading((prevState) => !prevState);
        const articleData = {
            title,
            description,
            content: [],
        };
        const { data, error } = await createArticle(token, articleData);
        setIsLoading((prevState) => !prevState);
        error
            ? toast({ title: error, variant: 'destructive' })
            : toast({ title: 'Article has been created successfully.' });
        setTitle('');
        setDescription('');
    };
    return (
        <form
            className={cn('grid items-start gap-4', className)}
            onSubmit={(e) => {
                e.preventDefault();
                submitHandler();
            }}
        >
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Battle between SQL and NOSQL"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="The Battle between SQL and NoSQL: Choosing the Right Database for Your Web Application"
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <Fragment>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please
                        wait...
                    </Fragment>
                ) : (
                    'Submit'
                )}
            </Button>
        </form>
    );
}
