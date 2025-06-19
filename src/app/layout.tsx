import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { VoteProvider } from '@/contexts/vote-context';
import { Header } from '@/components/layout/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VoteNow - 簡易投票・アンケートサイト',
  description: '簡単に投票やアンケートを作成・参加できるWebアプリケーション',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="votenow-theme">
          <VoteProvider>
            <Header />
            {children}
          </VoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
