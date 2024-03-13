'use client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();
    return (
        <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
        </Button>
    );
};

export default BackButton;
