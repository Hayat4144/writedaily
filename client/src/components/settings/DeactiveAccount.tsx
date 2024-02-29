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
import { Heading5, Paragraph } from '../ui/typography';

export default function DeactiveAccount() {
    return (
        <Fragment>
            <AlertDialog>
                <AlertDialogTrigger className="text-justify">
                    <h3 className="text-destructive">Deactive account</h3>
                    <Paragraph className="text-muted-foreground text-sm">
                        Deactivating will suspend your account until you sign
                        back in.
                    </Paragraph>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate account </AlertDialogTitle>
                        <AlertDialogDescription>
                            Deactivating your account will remove it from
                            Writedaily within a few minutes. You can sign back
                            in anytime to reactivate your account and restore
                            its content.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Fragment>
    );
}
