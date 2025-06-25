'use client';

import { CheckCircle, List, Share2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PollWithStats } from '@/types/api';

interface VoteCardProps {
  vote: PollWithStats;
  hasVoted?: boolean;
  onShare?: (voteId: string) => void;
}

export function VoteCard({ vote, hasVoted = false, onShare }: VoteCardProps) {
  // カテゴリー情報をマッピング
  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { emoji: string; name: string; color: { light: string; dark: string } }> = {
      general: { emoji: '📊', name: '一般', color: { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-900 text-blue-200' } },
      work: { emoji: '💼', name: '仕事', color: { light: 'bg-gray-100 text-gray-800', dark: 'bg-gray-900 text-gray-200' } },
      event: { emoji: '🎉', name: 'イベント', color: { light: 'bg-green-100 text-green-800', dark: 'bg-green-900 text-green-200' } },
      poll: { emoji: '🗳️', name: 'アンケート', color: { light: 'bg-purple-100 text-purple-800', dark: 'bg-purple-900 text-purple-200' } },
      other: { emoji: '📋', name: 'その他', color: { light: 'bg-orange-100 text-orange-800', dark: 'bg-orange-900 text-orange-200' } },
    };
    return categoryMap[category] || categoryMap.other;
  };

  const categoryInfo = getCategoryInfo(vote.category);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'closed':
        return 'destructive';
      case 'draft':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '進行中';
      case 'closed':
        return '終了';
      case 'draft':
        return '下書き';
      default:
        return status;
    }
  };

  // 期限チェック
  const isExpired = vote.expiresAt ? new Date() > new Date(vote.expiresAt) : false;

  const handleShare = () => {
    if (onShare) {
      onShare(vote.id);
    } else {
      // フォールバック: URLをクリップボードにコピー
      const url = `${window.location.origin}/vote/${vote.id}`;
      navigator.clipboard.writeText(url).then(() => {
        // 通知を表示（実装に応じて）
        console.log('リンクをコピーしました');
      });
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn('gap-1', categoryInfo.color.light, 'dark:' + categoryInfo.color.dark)}
            >
              <span>{categoryInfo.emoji}</span>
              {categoryInfo.name}
            </Badge>
          </div>
          <Badge variant={getStatusBadgeVariant(vote.status)}>{getStatusText(vote.status)}</Badge>
        </div>

        {/* タイトル・説明 */}
        <h3 className="text-lg font-semibold mb-2 text-stone-800 dark:text-stone-200 line-clamp-2">
          {vote.title}
        </h3>
        {vote.description && (
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
            {vote.description}
          </p>
        )}

        {/* 統計情報 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
              <Users className="h-4 w-4" />
              {vote.totalVotes}票
            </span>
            <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
              <List className="h-4 w-4" />
              {vote.options.length}選択肢
            </span>
          </div>
          {hasVoted && (
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              投票済み
            </span>
          )}
        </div>

        {/* 時間情報 */}
        <div className="text-xs text-stone-400 dark:text-stone-500 mb-4">
          作成:{' '}
          {new Date(vote.createdAt).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {vote.status === 'active' && !isExpired && (
            <span> • 投票中</span>
          )}
          {isExpired && (
            <span> • 期限切れ</span>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2">
          {vote.status === 'active' && !hasVoted && !isExpired ? (
            <Button asChild className="flex-1">
              <a href={`/vote/${vote.id}`}>投票する</a>
            </Button>
          ) : (
            <Button variant="secondary" asChild className="flex-1">
              <a href={`/vote/${vote.id}`}>結果を見る</a>
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={handleShare} title="共有">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
