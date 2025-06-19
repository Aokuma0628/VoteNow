'use client';

import { Header } from './header';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
}

export function AppLayout({ children, title, headerActions }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ヘッダー */}
      <Header title={title} actions={headerActions} />

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto bg-muted/30">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
