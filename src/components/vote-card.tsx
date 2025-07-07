'use client';

import { CheckCircle, List, Trash2, Users, MoreVertical, Settings } from 'lucide-react';
import { ShareMenu } from '@/components/share-menu';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { PollWithStats } from '@/types/api';
import { DeletePollDialog } from './delete-poll-dialog';

interface VoteCardProps {
  vote: PollWithStats;
  hasVoted?: boolean;
  _onShare?: (voteId: string) => void;
  onDelete?: (voteId: string) => void;
  onStatusChange?: (voteId: string, newStatus: string) => void;
  canDelete?: boolean;
  canManage?: boolean;
}

export function VoteCard({
  vote,
  hasVoted = false,
  _onShare,
  onDelete,
  onStatusChange,
  canDelete = false,
  canManage = false,
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
    const categoryMap: Record<string, { emoji: string; name: string; color: string }> = {
      general: {
        emoji: '📊',
        name: '一般',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      },
      work: {
        emoji: '💼',
        name: '仕事',
        color: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200',
      },
      event: {
        emoji: '🎉',
        name: 'イベント',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
      poll: {
        emoji: '🗳️',
        name: 'アンケート',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      },
      other: {
        emoji: '📋',
        name: 'その他',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
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


  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(vote.id, newStatus);
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
      <article
        className={cn(
          'h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
          isAnimating && 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg',
        )}
        aria-labelledby={`vote-title-${vote.id}`}
        aria-describedby={`vote-desc-${vote.id} vote-stats-${vote.id}`}
      >
        <Card className="h-full">
          <CardContent className="p-6">
            {/* ライブリージョン（投票数の変更を通知） */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {isAnimating ? `投票数が${displayVotes}票に更新されました` : ''}
            </div>

            {/* ヘッダー */}
            <header className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn('gap-1', categoryInfo.color)}
                  aria-label={`カテゴリー: ${categoryInfo.name}`}
                >
                  <span aria-hidden="true">{categoryInfo.emoji}</span>
                  {categoryInfo.name}
                </Badge>
              </div>
              <Badge
                variant={getStatusBadgeVariant(actualStatus)}
                aria-label={`投票状態: ${getStatusText(actualStatus)}`}
              >
                {getStatusText(actualStatus)}
              </Badge>
            </header>

            {/* タイトル・説明 */}
            <h3
              id={`vote-title-${vote.id}`}
              className="text-lg font-semibold mb-2 text-stone-800 dark:text-stone-200 line-clamp-2"
            >
              {vote.title}
            </h3>
            {vote.description && (
              <p
                id={`vote-desc-${vote.id}`}
                className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2"
              >
                {vote.description}
              </p>
            )}

            {/* 統計情報 */}
            <div
              id={`vote-stats-${vote.id}`}
              className="flex items-center justify-between mb-4"
              role="group"
              aria-label="投票統計情報"
            >
              <div className="flex items-center gap-4 text-sm">
                <span
                  className={cn(
                    'flex items-center gap-1 text-stone-500 dark:text-stone-400 transition-all duration-300',
                    isAnimating && 'text-blue-600 dark:text-blue-400 font-semibold',
                  )}
                  aria-label={`現在の投票数: ${displayVotes}票`}
                >
                  <Users
                    className={cn('h-4 w-4', isAnimating && 'animate-vote-pulse')}
                    aria-hidden="true"
                  />
                  {displayVotes}票
                </span>
                <span
                  className="flex items-center gap-1 text-stone-500 dark:text-stone-400"
                  aria-label={`選択肢数: ${vote.options.length}個`}
                >
                  <List className="h-4 w-4" aria-hidden="true" />
                  {vote.options.length}選択肢
                </span>
              </div>
              {hasVoted && (
                <span
                  className="flex items-center gap-1 text-emerald-600 text-sm font-medium"
                  aria-label="この投票にはすでに投票済みです"
                >
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  投票済み
                </span>
              )}
            </div>

            {/* 時間情報 */}
            <div
              className="text-xs text-stone-400 dark:text-stone-500 mb-4"
              aria-label="投票の作成日時と状態"
            >
              <time dateTime={vote.createdAt}>
                作成:{' '}
                {new Date(vote.createdAt).toLocaleDateString('ja-JP', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
              {actualStatus === 'active' && <span> • 投票中</span>}
              {actualStatus === 'closed' && <span> • 終了</span>}
              {actualStatus === 'draft' && <span> • 下書き</span>}
            </div>

            {/* アクションボタン */}
            <footer className="flex gap-2" role="group" aria-label="投票アクション">
              {actualStatus === 'active' && !hasVoted ? (
                <Button asChild className="flex-1">
                  <a
                    href={`/vote/${vote.id}`}
                    aria-describedby={`vote-title-${vote.id}`}
                    className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md"
                  >
                    投票する
                  </a>
                </Button>
              ) : (
                <Button variant="secondary" asChild className="flex-1">
                  <a
                    href={`/vote/${vote.id}`}
                    aria-describedby={`vote-title-${vote.id}`}
                    className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md"
                  >
                    結果を見る
                  </a>
                </Button>
              )}
              <ShareMenu 
                title={vote.title}
                description={vote.description || '投票に参加してください！'}
                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/vote/${vote.id}`}
              />
              {(canDelete || canManage) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`「${vote.title}」を管理`}
                      aria-expanded="false"
                      aria-haspopup="menu"
                      className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md"
                    >
                      <MoreVertical className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" role="menu">
                    {canManage && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(actualStatus === 'active' ? 'closed' : 'active')
                          }
                          className="flex items-center gap-2"
                          role="menuitem"
                        >
                          <Settings className="h-4 w-4" aria-hidden="true" />
                          {actualStatus === 'active' ? '投票を終了' : '投票を再開'}
                        </DropdownMenuItem>
                        {canDelete && <DropdownMenuSeparator />}
                      </>
                    )}
                    {canDelete && (
                      <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                        role="menuitem"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        削除
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </footer>
          </CardContent>
        </Card>
      </article>

      <DeletePollDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        pollTitle={vote.title}
        onConfirm={handleDelete}
      />
    </>
  );
}
