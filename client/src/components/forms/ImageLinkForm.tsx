import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSlate } from 'slate-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { MyImageELement, componentType } from '@/types';
import generateNodeId from '@/lib/generateNodeId';
import editorUtility from '@/lib/editorUtility';

const FormSchema = z.object({
    link: z.string().url({ message: 'Please enter valid url.' }),
});

interface ImageLinkFormProps {
    // setOpen: (value: boolean) => void;
    compType: componentType;
}

export default function ImageLinkForm({ compType }: ImageLinkFormProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    const editor = useSlate();
    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        if (compType === 'image') {
            const ImageELement: MyImageELement = {
                id: generateNodeId(),
                type: 'image',
                url: data.link,
                children: [{ text: '' }],
            };
            editorUtility.insertNode<MyImageELement>(editor, ImageELement);
        } else {
            editorUtility.toggleLink(editor, data.link);
        }
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
            >
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Paste your link here"
                                    {...field}
                                    className="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
