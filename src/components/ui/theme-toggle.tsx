'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getCurrentThemeName = () => {
    switch (theme) {
      case 'light':
        return 'ライトテーマ';
      case 'dark':
        return 'ダークテーマ';
      case 'system':
        return 'システムテーマ';
      default:
        return 'テーマ';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`現在のテーマ: ${getCurrentThemeName()}。クリックしてテーマを変更`}
          aria-expanded="false"
          aria-haspopup="menu"
          className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Sun
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            aria-hidden="true"
          />
          <Moon
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            aria-hidden="true"
          />
          <span className="sr-only">テーマを切り替える</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" role="menu" aria-label="テーマ選択メニュー">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          role="menuitem"
          className="flex items-center gap-2 focus:outline-none focus:bg-emerald-50 focus:text-emerald-900"
          aria-describedby="light-theme-desc"
        >
          <Sun className="h-4 w-4" aria-hidden="true" />
          <span>ライト</span>
          {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
          <span id="light-theme-desc" className="sr-only">
            明るい背景色でページを表示します
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          role="menuitem"
          className="flex items-center gap-2 focus:outline-none focus:bg-emerald-50 focus:text-emerald-900"
          aria-describedby="dark-theme-desc"
        >
          <Moon className="h-4 w-4" aria-hidden="true" />
          <span>ダーク</span>
          {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
          <span id="dark-theme-desc" className="sr-only">
            暗い背景色でページを表示します
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          role="menuitem"
          className="flex items-center gap-2 focus:outline-none focus:bg-emerald-50 focus:text-emerald-900"
          aria-describedby="system-theme-desc"
        >
          <Monitor className="h-4 w-4" aria-hidden="true" />
          <span>システム</span>
          {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
          <span id="system-theme-desc" className="sr-only">
            システムの設定に従ってテーマを自動選択します
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
