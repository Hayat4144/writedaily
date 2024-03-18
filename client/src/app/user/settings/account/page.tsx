import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AccountForm from '@/components/forms/settings/AccountForm';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
    title: 'Account Settings | Writedaily',
    description:
        'Manage your profile and account settings on WriteDaily. Update your personal information, privacy settings, and account preferences.',
};

export default async function page() {
    const session = await getServerSession(authOptions);
    if (!session) return redirect('/auth/signin');
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">
                    Update your account by changing your password, upate profile
                    pic and deactivate your account or delete your account.
                </p>
            </div>
            <Separator />
            <AccountForm />
        </div>
    );
}
