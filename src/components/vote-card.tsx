'use client';

import { CheckCircle, List, Share2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Vote, VOTE_CATEGORIES, VOTE_STATUS } from '@/types/vote';
import { VoteUtils } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface VoteCardProps {
  vote: Vote;
  hasVoted?: boolean;
  onShare?: (voteId: string) => void;
}

export function VoteCard({ vote, hasVoted = false, onShare }: VoteCardProps) {
  const category = VOTE_CATEGORIES[vote.category];
  const timeRemaining = VoteUtils.getTimeRemaining(vote);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case VOTE_STATUS.ACTIVE:
        return 'default';
      case VOTE_STATUS.CLOSED:
        return 'destructive';
      case VOTE_STATUS.DRAFT:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case VOTE_STATUS.ACTIVE:
        return '進行中';
      case VOTE_STATUS.CLOSED:
        return '終了';
      case VOTE_STATUS.DRAFT:
        return '下書き';
      default:
        return status;
    }
  };

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
              className={cn(
                'gap-1',
                'bg-opacity-20 border',
                vote.category === 'work' &&
                  'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
                vote.category === 'lifestyle' &&
                  'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
                vote.category === 'food' &&
                  'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
                vote.category === 'event' &&
                  'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
                vote.category === 'other' &&
                  'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
              )}
            >
              <span>{category.emoji}</span>
              {category.name}
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
          {VoteUtils.formatDate(vote.createdAt, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {vote.status === VOTE_STATUS.ACTIVE && (
            <span> • {VoteUtils.formatTimeRemaining(timeRemaining)}</span>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2">
          {vote.status === VOTE_STATUS.ACTIVE && !hasVoted ? (
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
