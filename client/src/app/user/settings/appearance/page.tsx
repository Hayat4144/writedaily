import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AppearanceForm } from '@/components/forms/settings/AppearancForm';
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
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                    Customize the appearance of the app. Automatically switch
                    between day and night themes.
                </p>
            </div>
            <Separator />
            <AppearanceForm />
        </div>
    );
}
