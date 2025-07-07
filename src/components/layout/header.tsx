'use client';

import { Plus, Vote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { RealtimeStatusDot } from '@/components/realtime-status';

interface HeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
  const siteTitle = title || 'VoteNow';

  return (
    <header
      role="banner"
      aria-label="サイトヘッダー"
      className="backdrop-blur-md border-b transition-all duration-300 bg-white/80 dark:bg-stone-900/80 border-stone-200/60 dark:border-stone-700/60 sticky top-0 z-40"
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <Link
            href="/"
            className="flex items-center gap-4 hover:opacity-80 transition-opacity focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg"
            aria-label={`${siteTitle}ホームページに移動`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 relative"
              aria-hidden="true"
            >
              <Vote className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <RealtimeStatusDot className="absolute -top-1 -right-1" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold transition-colors duration-300 text-stone-800 dark:text-stone-200"
                id="site-title"
              >
                {siteTitle}
              </h1>
              <p
                className="text-sm transition-colors duration-300 text-stone-500 dark:text-stone-400"
                aria-describedby="site-title"
              >
                簡易投票・アンケートサイト
              </p>
            </div>
          </Link>

          {/* 右側ボタン */}
          <nav
            role="navigation"
            aria-label="メインナビゲーション"
            className="flex items-center gap-2"
          >
            {/* カスタムアクション */}
            {actions}

            {/* モバイル投票作成ボタン */}
            <Button asChild variant="ghost" size="icon" className="md:hidden text-emerald-600">
              <a
                href="/create"
                aria-label="新しい投票を作成"
                className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">投票作成</span>
              </a>
            </Button>

            {/* テーマ切り替えボタン */}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
