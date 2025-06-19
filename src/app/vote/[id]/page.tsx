'use client';

import { notFound } from 'next/navigation';
import { ArrowLeft, Share2, Users, Clock, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoteChart } from '@/components/vote-chart';
import { mockVotes, VoteUtils } from '@/lib/mock-data';
import { VOTE_CATEGORIES } from '@/types/vote';
import Link from 'next/link';
import { useState } from 'react';

interface VoteDetailPageProps {
  params: {
    id: string;
  };
}

export default function VoteDetailPage({ params }: VoteDetailPageProps) {
  const vote = mockVotes.find(v => v.id === params.id);
  const [showPercentage, setShowPercentage] = useState(true);
  
  if (!vote) {
    notFound();
  }

  const category = VOTE_CATEGORIES[vote.category];
  const timeRemaining = VoteUtils.getTimeRemaining(vote);
  const hasVoted = VoteUtils.hasUserVoted(vote.id);
  const userVotes = VoteUtils.getUserVote(vote.id);

  // 投票の共有機能
  const handleShare = async () => {
    const url = `${window.location.origin}/vote/${vote.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: vote.title,
          text: vote.description || '投票に参加してください！',
          url: url,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50 dark:from-gray-900 dark:via-stone-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            共有
          </Button>
        </div>

        {/* 投票情報 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className={`${category.color.light} dark:${category.color.dark}`}
                  >
                    {category.emoji} {category.name}
                  </Badge>
                  <Badge
                    variant={vote.status === 'active' ? 'default' : 'secondary'}
                    className={
                      vote.status === 'active'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400'
                    }
                  >
                    {vote.status === 'active' ? '進行中' : '終了'}
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-2">{vote.title}</CardTitle>
                {vote.description && (
                  <p className="text-gray-600 dark:text-gray-400">{vote.description}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  総投票数: <span className="font-semibold">{vote.totalVotes}票</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {VoteUtils.formatTimeRemaining(timeRemaining)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">
                  作成: {VoteUtils.formatDate(vote.createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* グラフ表示制御 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            投票結果
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant={showPercentage ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPercentage(true)}
            >
              割合表示
            </Button>
            <Button
              variant={!showPercentage ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPercentage(false)}
            >
              票数表示
            </Button>
          </div>
        </div>

        {/* 投票結果グラフ */}
        <VoteChart 
          vote={vote} 
          showPercentage={showPercentage}
          height={400}
          className="mb-6"
        />

        {/* 投票選択肢の詳細 */}
        <Card>
          <CardHeader>
            <CardTitle>選択肢詳細</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {VoteUtils.sortOptionsByVotes(vote.options).map((option, index) => {
                const isSelected = userVotes.includes(option.id);
                const percentage = VoteUtils.getVotePercentage(option, vote.totalVotes);
                
                return (
                  <div 
                    key={option.id} 
                    className={`p-4 rounded-lg border ${
                      isSelected 
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            #{index + 1} {option.text}
                          </span>
                          {isSelected && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              投票済み
                            </Badge>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {option.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {option.votes}票
                        </div>
                        <div className="text-sm text-gray-500">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    
                    {/* プログレスバー */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 投票者情報 */}
        {hasVoted && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 inline mr-1" />
                あなたはこの投票に参加しています
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}