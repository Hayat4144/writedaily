import { useSession } from 'next-auth/react';
import { Fragment, useState } from 'react';
import { toast } from '../ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { createArticleSchema } from '@/lib/validation/articleSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { createArticleActions } from '@/app/action';
import { cn } from '@/lib/utils';

type CreateArticleInput = z.infer<typeof createArticleSchema>;

export function ArticleForm({ className }: React.ComponentProps<'form'>) {
    const session = useSession();
    const token = session.data?.user.AccessToken as string;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<CreateArticleInput>({
        resolver: zodResolver(createArticleSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const onSubmit = async (values: CreateArticleInput) => {
        if (!token) return;
        setIsLoading((prevState) => !prevState);
        const { error } = await createArticleActions(token, values);
        setIsLoading((prevState) => !prevState);
        if (error) {
            return toast({ title: error, variant: 'destructive' });
        }
        toast({ title: `${values.title} has been created successfully.` });
        form.reset();
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('grid item-start gap-4', className)}
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Battle between SQL and NOSQL"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="The Battle between SQL and NoSQL: Choosing the Right Database for Your Web Application."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <Fragment>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                            please wait...
                        </Fragment>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </form>
        </Form>
    );
}
