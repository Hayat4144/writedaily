'use client';
import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

interface ProviderProps {
    children: React.ReactNode;
}

export default function Provider({ children }: ProviderProps) {
    return (
        <SessionProvider>
            <NextThemesProvider
                attribute="class"
                enableSystem
                defaultTheme="system"
            >
                {children}
            </NextThemesProvider>
        </SessionProvider>
    );
}
