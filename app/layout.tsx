import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppProviders } from '@/app';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Менеджер задач',
  description: 'Списки задач с дедлайнами, приоритетами и прогрессом',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <InitColorSchemeScript defaultMode="system" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
