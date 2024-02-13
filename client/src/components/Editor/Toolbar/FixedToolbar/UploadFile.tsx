import React, { Fragment, useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import editorUtility from '@/lib/editorUtility';
import { useSlate } from 'slate-react';

export default function UploadImage() {
    const [isLoading, setisLoadingToggle] = useState(false);
    const editor = useSlate();
    const Imageupload = async (files: FileList) => {
        setisLoadingToggle(true);
        if (files && files.length > 0) {
            const filesArray = Array.from(files);
            await editorUtility.uploadImage(editor, filesArray);
            setisLoadingToggle(false);
        }
    };
    return (
        <Fragment>
            {!isLoading ? (
                <div className="flex items-center space-x-2 pt-4">
                    <Label
                        htmlFor="file"
                        className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'cursor-pointer w-full',
                        )}
                    >
                        Upload file
                    </Label>
                    <input
                        type="file"
                        multiple
                        hidden
                        id="file"
                        onChange={(e) => {
                            e.preventDefault();
                            e.target.files && Imageupload(e.target.files);
                        }}
                    />
                </div>
            ) : (
                <Button
                    disabled
                    className="w-full cursor-not-allowed"
                    variant={'outline'}
                >
                    <Loader2 className="mr-2 animate-spin" />
                    Please wait
                </Button>
            )}
            <small className="text-sm font-medium text-muted-foreground">
                The Maximum size per image is 2Mb.{' '}
            </small>
        </Fragment>
    );
}
