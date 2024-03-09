import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ProfileForm from '@/components/forms/settings/ProfileForm';
import { Separator } from '@/components/ui/separator';
import { userById } from '@/externalapi/UserService';
import { getServerSession } from 'next-auth';
import React from 'react';

export default async function page() {
    const session = await getServerSession(authOptions);
    const { data, error } = await userById(session?.user.id as string);
    if (error) throw new Error(error);
    const { name, username, bio } = data;
    const formData = { name, username, bio };
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>
            <Separator />
            <ProfileForm values={formData} />
        </div>
    );
}
