import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import type { ReactNode } from 'react';

import Layout from '@/components/Layout';
import '@if/ui/styles.css';
import '@/theme/global.css';
import ThemeScript from '@/lib/getTheme';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
