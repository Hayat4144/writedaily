'use client';
import DeactiveAccount from '@/components/settings/DeactiveAccount';
import DeleteAccount from '@/components/settings/DeleteAccount';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { profileFormSchema } from '@/lib/validation/settings/SettingsSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AccountForm() {
    return (
        <Fragment>
            <DeactiveAccount />
            <DeleteAccount />
        </Fragment>
    );
}
