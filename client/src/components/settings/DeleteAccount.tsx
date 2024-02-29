'use client';
import React, { Fragment } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Paragraph } from '../ui/typography';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export default function DeleteAccount() {
    return (
        <AlertDialog>
            <AlertDialogTrigger className="text-justify">
                <h3 className="text-destructive">Delete account</h3>
                <Paragraph className="text-muted-foreground text-sm">
                    Permanently delete your account and all of your content.
                </Paragraph>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate account </AlertDialogTitle>
                    <AlertDialogDescription>
                        We’re sorry to see you go. Once your account is deleted,
                        all of your content will be permanently gone, including
                        your profile, articles, bookmarks, and library. If
                        you’re not sure about that, we suggest you deactivate.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="delete">
                        To confirm deletion, type “delete” below:
                    </Label>
                    <Input id="delete" />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
