import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { fontSans } from '@/lib/fonts';
import { Toaster } from '@/components/ui/sonner';
import Provider from '@/components/Provider';
import { Toaster as DefaultToster} from "@/components/ui/toaster"

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable,
                )}
            >
                <Provider>{children}</Provider>
                <Toaster />
                <DefaultToster />
            </body>
        </html>
    );
}
