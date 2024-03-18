import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import Link from 'next/link';
import SignupForm from '@/components/forms/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Signup | WriteDaily',
    description:
        'Sign in or create an account on WriteDaily to start your writing journey. Connect with other writers, share your stories, and explore creative writing resources.',
};

export default function page() {
    return (
        <Card className="max-w-lg w-full">
            <CardHeader className="space-y-1">
                <CardTitle>Create your account</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <SignupForm />
            </CardContent>
            <CardFooter className="grid gap-4">
                <div className="single-signin relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-2 tex-2xl">
                            Do you have an account?
                        </span>
                    </div>
                </div>
                <Button variant={'outline'}>
                    <Link href={'/auth/signin'}>Signin</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
