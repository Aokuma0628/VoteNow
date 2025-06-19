'use client';

import { Moon, Plus, Sun, Vote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';

interface HeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="backdrop-blur-md border-b transition-all duration-300 bg-white/80 dark:bg-stone-900/80 border-stone-200/60 dark:border-stone-700/60 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700">
              <Vote className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold transition-colors duration-300 text-stone-800 dark:text-stone-200">
                {title || 'VoteNow'}
              </h1>
              <p className="text-sm transition-colors duration-300 text-stone-500 dark:text-stone-400">
                簡易投票・アンケートサイト
              </p>
            </div>
          </div>

          {/* 右側ボタン */}
          <div className="flex items-center gap-2">
            {/* カスタムアクション */}
            {actions}

            {/* モバイル投票作成ボタン */}
            <Button asChild variant="ghost" size="icon" className="md:hidden text-emerald-600">
              <a href="/create">
                <Plus className="h-5 w-5" />
              </a>
            </Button>

            {/* テーマ切り替えボタン */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="テーマ切り替え"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
