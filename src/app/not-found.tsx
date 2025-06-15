import { Home, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50 dark:from-gray-900 dark:via-stone-900 dark:to-slate-900">
      <div className="max-w-md mx-auto px-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <Search className="h-10 w-10 text-stone-400 dark:text-stone-500" />
            </div>

            <h1 className="text-6xl font-bold mb-4 text-stone-800 dark:text-stone-200">404</h1>

            <h2 className="text-xl font-semibold mb-3 text-stone-700 dark:text-stone-300">
              ページが見つかりません
            </h2>

            <p className="text-stone-500 dark:text-stone-400 mb-6">
              お探しのページは存在しないか、移動された可能性があります。
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  ホームに戻る
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/create">新しい投票を作成</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
