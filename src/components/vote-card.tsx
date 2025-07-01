'use client';

import { CheckCircle, List, Share2, Trash2, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PollWithStats } from '@/types/api';
import { DeletePollDialog } from './delete-poll-dialog';

interface VoteCardProps {
  vote: PollWithStats;
  hasVoted?: boolean;
  onShare?: (voteId: string) => void;
  onDelete?: (voteId: string) => void;
  canDelete?: boolean;
}

export function VoteCard({
  vote,
  hasVoted = false,
  onShare,
  onDelete,
  canDelete = false,
}: VoteCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [displayVotes, setDisplayVotes] = useState(vote.totalVotes);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevVotesRef = useRef(vote.totalVotes);

  // 投票数が変化した時のアニメーション
  useEffect(() => {
    if (prevVotesRef.current !== vote.totalVotes) {
      setIsAnimating(true);

      // 数値のアニメーション
      const startValue = prevVotesRef.current;
      const endValue = vote.totalVotes;
      const duration = 500; // 500ms
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);

        // イージング関数（ease-out）
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);

        setDisplayVotes(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          prevVotesRef.current = vote.totalVotes;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [vote.totalVotes]);
  // カテゴリー情報をマッピング
  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<
      string,
      { emoji: string; name: string; color: { light: string; dark: string } }
    > = {
      general: {
        emoji: '📊',
        name: '一般',
        color: { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-900 text-blue-200' },
      },
      work: {
        emoji: '💼',
        name: '仕事',
        color: { light: 'bg-gray-100 text-gray-800', dark: 'bg-gray-900 text-gray-200' },
      },
      event: {
        emoji: '🎉',
        name: 'イベント',
        color: { light: 'bg-green-100 text-green-800', dark: 'bg-green-900 text-green-200' },
      },
      poll: {
        emoji: '🗳️',
        name: 'アンケート',
        color: { light: 'bg-purple-100 text-purple-800', dark: 'bg-purple-900 text-purple-200' },
      },
      other: {
        emoji: '📋',
        name: 'その他',
        color: { light: 'bg-orange-100 text-orange-800', dark: 'bg-orange-900 text-orange-200' },
      },
    };
    return categoryMap[category] || categoryMap.other;
  };

  const categoryInfo = getCategoryInfo(vote.category);

  // 期限チェック
  const isExpired = vote.expiresAt ? new Date() > new Date(vote.expiresAt) : false;

  const getActualStatus = () => {
    if (isExpired) return 'closed';
    return vote.status;
  };

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

  const actualStatus = getActualStatus();

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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(vote.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          'h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
          isAnimating && 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg',
        )}
      >
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
            <Badge variant={getStatusBadgeVariant(actualStatus)}>
              {getStatusText(actualStatus)}
            </Badge>
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
              <span
                className={cn(
                  'flex items-center gap-1 text-stone-500 dark:text-stone-400 transition-all duration-300',
                  isAnimating && 'text-blue-600 dark:text-blue-400 font-semibold',
                )}
              >
                <Users className={cn('h-4 w-4', isAnimating && 'animate-vote-pulse')} />
                {displayVotes}票
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
            {actualStatus === 'active' && <span> • 投票中</span>}
            {actualStatus === 'closed' && <span> • 終了</span>}
            {actualStatus === 'draft' && <span> • 下書き</span>}
          </div>

          {/* アクションボタン */}
          <div className="flex gap-2">
            {actualStatus === 'active' && !hasVoted ? (
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
            {canDelete && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDeleteDialogOpen(true)}
                title="削除"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <DeletePollDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        pollTitle={vote.title}
        onConfirm={handleDelete}
      />
    </>
  );
}
