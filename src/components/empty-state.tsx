'use client';

import { Inbox, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
        <Inbox className="h-8 w-8 text-stone-400 dark:text-stone-500" />
      </div>
      <h3 className="text-lg font-medium mb-2 text-stone-600 dark:text-stone-300">
        投票がありません
      </h3>
      <p className="text-sm text-stone-400 dark:text-stone-500 mb-4">
        条件に合う投票が見つかりませんでした
      </p>
      <Button asChild>
        <a href="/create">
          <Plus className="h-4 w-4 mr-2" />
          新しい投票を作成
        </a>
      </Button>
    </div>
  );
}
