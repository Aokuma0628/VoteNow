'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Clock, CheckCircle, Plus, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVote } from '@/contexts/vote-context';
import { VOTE_CATEGORIES, VOTE_STATUS } from '@/types/vote';
import { VoteUtils } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const voteId = params.id as string;

  const { 
    getVote, 
    castVote, 
    hasUserVoted, 
    getUserVote, 
    addVoteOption 
  } = useVote();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [newOptionText, setNewOptionText] = useState('');
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vote = getVote(voteId);
  const hasVoted = hasUserVoted(voteId);
  const userVote = getUserVote(voteId);

  useEffect(() => {
    if (hasVoted) {
      setSelectedOptions(userVote);
    }
  }, [hasVoted, userVote]);

  if (!vote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50 dark:from-gray-900 dark:via-stone-900 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">投票が見つかりません</h1>
            <Button onClick={() => router.push('/')}>
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const category = VOTE_CATEGORIES[vote.category];
  const timeRemaining = VoteUtils.getTimeRemaining(vote);
  const canVote = vote.status === VOTE_STATUS.ACTIVE && !timeRemaining.expired;

  // 選択肢の選択/選択解除
  const toggleOption = (optionId: string) => {
    if (!canVote) return;

    setSelectedOptions(prev => {
      if (vote.allowMultiple) {
        return prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId];
      } else {
        return prev.includes(optionId) ? [] : [optionId];
      }
    });
  };

  // 投票送信
  const handleSubmit = async () => {
    if (selectedOptions.length === 0) {
      alert('選択肢を選んでください');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = castVote(voteId, selectedOptions);
      if (success) {
        // 投票成功
      } else {
        alert('投票に失敗しました');
      }
    } catch (error) {
      console.error('投票エラー:', error);
      alert('投票に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 新しい選択肢を追加
  const handleAddOption = async () => {
    if (!newOptionText.trim()) {
      alert('選択肢のテキストを入力してください');
      return;
    }

    const success = addVoteOption(voteId, {
      text: newOptionText.trim()
    });

    if (success) {
      setNewOptionText('');
      setIsAddingOption(false);
    } else {
      alert('選択肢の追加に失敗しました');
    }
  };

  // 共有機能
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: vote.title,
          text: vote.description || '投票に参加してください！',
          url: url
        });
      } catch {
        console.log('共有がキャンセルされました');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('リンクをコピーしました');
      } catch (error) {
        console.error('クリップボードへのコピーに失敗しました:', error);
      }
    }
  };

  // 投票率を計算
  const getPercentage = (votes: number) => {
    if (vote.totalVotes === 0) return 0;
    return Math.round((votes / vote.totalVotes) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50 dark:from-gray-900 dark:via-stone-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className={cn(
                  'gap-1',
                  vote.category === 'work' &&
                    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
                  vote.category === 'lifestyle' &&
                    'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
                  vote.category === 'food' &&
                    'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
                  vote.category === 'event' &&
                    'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
                  vote.category === 'other' &&
                    'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                )}
              >
                <span>{category.emoji}</span>
                {category.name}
              </Badge>
              <Badge variant={vote.status === VOTE_STATUS.ACTIVE ? 'default' : 'destructive'}>
                {vote.status === VOTE_STATUS.ACTIVE ? '進行中' : '終了'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200">
              {vote.title}
            </h1>
          </div>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 投票説明 */}
            {vote.description && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-stone-600 dark:text-stone-400">
                    {vote.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 投票選択肢 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {canVote && !hasVoted ? '投票してください' : '投票結果'}
                  {hasVoted && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      投票済み
                    </Badge>
                  )}
                </CardTitle>
                {vote.allowMultiple && canVote && !hasVoted && (
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    複数選択可能です
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {vote.options.map((option) => {
                  const percentage = getPercentage(option.votes);
                  const isSelected = selectedOptions.includes(option.id);
                  const userVoted = userVote.includes(option.id);

                  return (
                    <div key={option.id} className="space-y-2">
                      <div
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all',
                          canVote && !hasVoted
                            ? 'hover:bg-stone-50 dark:hover:bg-stone-800'
                            : 'cursor-default',
                          isSelected && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
                          userVoted && 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        )}
                        onClick={() => toggleOption(option.id)}
                      >
                        {canVote && !hasVoted && (
                          <Checkbox
                            checked={isSelected}
                            onChange={() => {}}
                            className="pointer-events-none"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.text}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-stone-600 dark:text-stone-400">
                                {option.votes}票
                              </span>
                              {(hasVoted || vote.status === VOTE_STATUS.CLOSED) && (
                                <span className="text-sm font-medium">
                                  {percentage}%
                                </span>
                              )}
                            </div>
                          </div>
                          {option.description && (
                            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* 投票率バー */}
                      {(hasVoted || vote.status === VOTE_STATUS.CLOSED) && (
                        <div className="ml-6">
                          <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all duration-300',
                                userVoted
                                  ? 'bg-green-500'
                                  : 'bg-blue-500'
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 新しい選択肢を追加 */}
                {vote.allowAddOptions && canVote && (
                  <div className="pt-4 border-t">
                    {isAddingOption ? (
                      <div className="flex gap-2">
                        <Input
                          value={newOptionText}
                          onChange={(e) => setNewOptionText(e.target.value)}
                          placeholder="新しい選択肢を入力"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                        />
                        <Button onClick={handleAddOption} size="sm">
                          追加
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setIsAddingOption(false);
                            setNewOptionText('');
                          }}
                        >
                          キャンセル
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingOption(true)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        新しい選択肢を追加
                      </Button>
                    )}
                  </div>
                )}

                {/* 投票ボタン */}
                {canVote && !hasVoted && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || selectedOptions.length === 0}
                      className="w-full"
                    >
                      {isSubmitting ? '投票中...' : '投票する'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 投票統計 */}
            <Card>
              <CardHeader>
                <CardTitle>投票情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-stone-500" />
                  <span className="text-sm">
                    {vote.totalVotes}人が投票
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-stone-500" />
                  <span className="text-sm">
                    {vote.status === VOTE_STATUS.ACTIVE
                      ? VoteUtils.formatTimeRemaining(timeRemaining)
                      : '投票終了'
                    }
                  </span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-stone-500">
                    作成: {VoteUtils.formatDate(vote.createdAt)}
                  </p>
                  <p className="text-xs text-stone-500">
                    作成者: {vote.createdBy.name}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 投票設定 */}
            <Card>
              <CardHeader>
                <CardTitle>投票設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>複数選択</span>
                  <Badge variant={vote.allowMultiple ? 'default' : 'secondary'}>
                    {vote.allowMultiple ? '可能' : '不可'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>選択肢追加</span>
                  <Badge variant={vote.allowAddOptions ? 'default' : 'secondary'}>
                    {vote.allowAddOptions ? '可能' : '不可'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>公開設定</span>
                  <Badge variant={vote.isPublic ? 'default' : 'secondary'}>
                    {vote.isPublic ? '公開' : '非公開'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}