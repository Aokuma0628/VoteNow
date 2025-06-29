'use client';

import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VoteCard } from '@/components/vote-card';
import { StatsCard } from '@/components/stats-card';
import { EmptyState } from '@/components/empty-state';
import { AppLayout } from '@/components/layout/app-layout';
import { toast } from 'sonner';
import { usePolls, useAllUserVotes } from '@/lib/hooks/use-polls';
import { useMemo, useCallback } from 'react';
import { useRealtime } from '@/lib/hooks/use-realtime';
import { RealtimeStatus } from '@/components/realtime-status';
import { useSWRConfig } from 'swr';

export default function Home() {
  const { polls, total, isLoading, isError, error } = usePolls();
  const { mutate } = useSWRConfig();

  // ユーザーの投票履歴を取得
  const { votesByPoll } = useAllUserVotes();

  // リアルタイム機能
  useRealtime();

  // 新しい順でソート（APIからのデータは既にソート済みですが、念のため）
  const sortedPolls = useMemo(
    () =>
      [...polls].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [polls],
  );

  // 統計情報を計算
  const stats = useMemo(() => {
    const activePolls = polls.filter(poll => {
      const isExpired = poll.expiresAt ? new Date() > new Date(poll.expiresAt) : false;
      return poll.status === 'active' && !isExpired;
    });
    return {
      active: activePolls.length,
      total,
    };
  }, [polls, total]);

  // 投票の共有機能
  const handleShare = async (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    const url = `${window.location.origin}/vote/${pollId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: poll.title,
          text: poll.description || '投票に参加してください！',
          url: url,
        });
      } catch {
        // ユーザーがキャンセルした場合など
        console.log('共有がキャンセルされました');
      }
    } else {
      // Web Share API が利用できない場合はクリップボードにコピー
      try {
        await navigator.clipboard.writeText(url);
        toast.success('リンクをコピーしました');
      } catch (error) {
        console.error('クリップボードへのコピーに失敗しました:', error);
      }
    }
  };

  // 投票の削除機能
  const handleDelete = useCallback(
    async (pollId: string) => {
      try {
        const response = await fetch(`/api/polls/${pollId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '削除に失敗しました');
        }

        // SWRのキャッシュを更新
        await mutate('/api/polls');

        toast.success('投票を削除しました');
      } catch (error) {
        console.error('削除エラー:', error);
        toast.error(error instanceof Error ? error.message : '削除に失敗しました');
      }
    },
    [mutate],
  );

  // エラー表示
  if (isError) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-stone-600 dark:text-stone-400">
            {error?.message || '投票データの取得に失敗しました'}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto">
        {/* ヒーロー・統計セクション */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* メインタイトル */}
            <div className="lg:col-span-2">
              <Card className="h-full transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-3 text-stone-800 dark:text-stone-200">
                      みんなで決めよう
                    </h2>
                    <p className="text-lg text-stone-600 dark:text-stone-400 mb-4">
                      簡単に投票を作成して、みんなの意見を集めることができます
                    </p>
                    <Button asChild>
                      <a href="/create">
                        <Plus className="h-4 w-4 mr-2" />
                        新しい投票を作成
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 統計情報 */}
            <StatsCard
              icon={Users}
              value={stats.active}
              label="進行中の投票"
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100 border-blue-200"
            />

            {/* リアルタイム状態 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-stone-900 dark:text-stone-100">
                  リアルタイム更新
                </h3>
                <RealtimeStatus showReconnectButton={false} />
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
                  新しい投票や投票結果の変更がリアルタイムで反映されます
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 投票一覧セクション */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ローディングスケルトン */}
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-64 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded mb-4"></div>
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded mb-2"></div>
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded mb-6"></div>
                    <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedPolls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPolls.map(poll => (
                <VoteCard
                  key={poll.id}
                  vote={poll}
                  hasVoted={!!votesByPoll[poll.id]}
                  onShare={handleShare}
                  onDelete={handleDelete}
                  canDelete={true}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        {/* フッター情報 */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <div className="text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              VoteNow - みんなで決める、簡単投票プラットフォーム
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
