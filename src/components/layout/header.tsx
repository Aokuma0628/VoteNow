'use client';

import { useState } from 'react';
import { LogIn, Moon, Plus, Sun, Vote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';
import { RealtimeStatusDot } from '@/components/realtime-status';
import { useAuth } from '@/lib/hooks/use-auth';
import { LoginDialog } from '@/components/auth/login-dialog';
import { UserMenu } from '@/components/auth/user-menu';

interface HeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <header className="backdrop-blur-md border-b transition-all duration-300 bg-white/80 dark:bg-stone-900/80 border-stone-200/60 dark:border-stone-700/60 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 relative">
              <Vote className="h-5 w-5 text-emerald-600" />
              <RealtimeStatusDot className="absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold transition-colors duration-300 text-stone-800 dark:text-stone-200">
                {title || 'VoteNow'}
              </h1>
              <p className="text-sm transition-colors duration-300 text-stone-500 dark:text-stone-400">
                簡易投票・アンケートサイト
              </p>
            </div>
          </Link>

          {/* 右側ボタン */}
          <div className="flex items-center gap-2">
            {/* カスタムアクション */}
            {actions}

            {/* ユーザーメニュー/ログインボタン */}
            {!isLoading &&
              (isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginDialog(true)}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">ログイン</span>
                </Button>
              ))}

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

      {/* ログインダイアログ */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  );
}
