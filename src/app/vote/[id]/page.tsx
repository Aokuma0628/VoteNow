'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Share2,
  RefreshCw,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VoteResults } from '@/components/vote-results';
import { VoteChart } from '@/components/vote-chart';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/app-layout';
import { toast } from 'sonner';
import { usePoll, castVote, useUserVotes } from '@/lib/hooks/use-polls';
import { useRealtimePoll } from '@/lib/hooks/use-realtime';
import { RealtimeStatus } from '@/components/realtime-status';

export default function VoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = Array.isArray(params.id) ? params.id[0] : params.id;

  // SWRでデータ取得
  const { poll, isLoading, isError, error, mutate } = usePoll(pollId);

  // ユーザーの投票履歴を取得
  const {
    hasVoted: userHasVoted,
    optionIds: userVoteOptions,
    mutate: mutateUserVotes,
  } = useUserVotes(pollId);

  // リアルタイム機能
  const { isConnected } = useRealtimePoll(pollId);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (poll) {
      // ユーザーが投票済みかチェック
      if (userHasVoted) {
        setShowResults(true);
      } else {
        setShowResults(poll.status === 'closed');
      }
    }
  }, [poll, userHasVoted]);

  const handleShare = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: poll?.title || '投票',
        text: poll?.description || '投票に参加してください！',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('リンクをコピーしました');
      });
    }
  };

  const handleVoteSubmit = async () => {
    if (selectedOptions.length === 0) return;

    setShowConfirmModal(true);
  };

  const confirmVote = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    // 投票処理
    try {
      if (pollId) {
        // API経由で投票を実行
        await castVote(pollId, { optionIds: selectedOptions });

        // データを再取得してUI更新
        mutate();
        mutateUserVotes();

        // 結果を表示
        setShowResults(true);
        toast.success('投票が完了しました！');
      }
    } catch (error) {
      console.error('投票の送信に失敗しました:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '投票の送信に失敗しました。もう一度お試しください。';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (!canVote) return;

    if (poll?.allowMultiple) {
      // 複数選択の場合
      setSelectedOptions(prev =>
        prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId],
      );
    } else {
      // 単一選択の場合
      setSelectedOptions([optionId]);
    }
  };

  const refreshResults = () => {
    // 結果を更新
    mutate();
    toast.info('結果を更新しました');
  };

  // ローディング中
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded mb-2 w-full"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded"></div>
                <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded"></div>
                <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // エラー状態
  if (isError || (!isLoading && !poll)) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {isError ? 'エラーが発生しました' : '投票が見つかりません'}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                {isError
                  ? error?.message || '投票データの取得に失敗しました'
                  : '指定された投票は存在しないか、削除された可能性があります'}
              </p>
              <Button onClick={() => router.push('/')}>ホームに戻る</Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!poll) return null; // ローディング中やデータなしの場合

  // カテゴリー情報を定義（APIデータから取得できない場合の仮設定）
  const categoryInfo = {
    name: poll.category,
    emoji: '📊',
    color: {
      light: 'bg-blue-100 text-blue-800',
      dark: 'bg-blue-900 text-blue-200',
    },
  };

  // 期限チェック
  const isExpired = poll.expiresAt ? new Date() > new Date(poll.expiresAt) : false;
  const canVote = poll.status === 'active' && !userHasVoted && !isExpired;

  return (
    <AppLayout
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare} title="共有">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/')} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ホームに戻る
          </Button>
        </div>

        {/* 投票詳細ヘッダー */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'gap-1',
                      categoryInfo.color.light,
                      'dark:' + categoryInfo.color.dark,
                    )}
                  >
                    <span>{categoryInfo.emoji}</span>
                    {categoryInfo.name}
                  </Badge>
                  <Badge variant={poll.status === 'active' ? 'default' : 'destructive'}>
                    {poll.status === 'active' ? '進行中' : '終了'}
                  </Badge>
                  {userHasVoted && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 border-emerald-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      投票済み
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-3">{poll.title}</h1>
                {poll.description && (
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {poll.description}
                  </p>
                )}
              </div>
            </div>

            {poll.status === 'active' && !isExpired && poll.expiresAt && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    期限: {new Date(poll.expiresAt).toLocaleDateString('ja-JP')}{' '}
                    {new Date(poll.expiresAt).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* メインコンテンツ - 3カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン投票/結果エリア - 2カラム分 */}
          <div className="lg:col-span-2">
            {/* 投票フォーム */}
            {canVote && !showResults && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>投票してください</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {poll.allowMultiple ? (
                      // 複数選択の場合：Checkboxを使用
                      poll.options.map(option => (
                        <label
                          key={option.id}
                          className={cn(
                            'block p-4 rounded-lg border cursor-pointer transition-all duration-200',
                            'hover:bg-stone-50 dark:hover:bg-stone-800',
                            selectedOptions.includes(option.id)
                              ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400'
                              : 'bg-white dark:bg-gray-800 border-stone-200 dark:border-stone-700',
                          )}
                          onClick={() => handleOptionSelect(option.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedOptions.includes(option.id)}
                              onCheckedChange={() => {}}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{option.text}</div>
                              {option.description && (
                                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                                  {option.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </label>
                      ))
                    ) : (
                      // 単一選択の場合：RadioGroupを使用
                      <RadioGroup
                        value={selectedOptions[0] || ''}
                        onValueChange={value => setSelectedOptions([value])}
                      >
                        {poll.options.map(option => (
                          <div
                            key={option.id}
                            className={cn(
                              'block p-4 rounded-lg border cursor-pointer transition-all duration-200',
                              'hover:bg-stone-50 dark:hover:bg-stone-800',
                              selectedOptions.includes(option.id)
                                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400'
                                : 'bg-white dark:bg-gray-800 border-stone-200 dark:border-stone-700',
                            )}
                          >
                            <label
                              htmlFor={option.id}
                              className="flex items-start gap-3 cursor-pointer"
                            >
                              <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                              <div className="flex-1">
                                <div className="font-medium">{option.text}</div>
                                {option.description && (
                                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={handleVoteSubmit}
                        disabled={selectedOptions.length === 0 || isSubmitting}
                        className="px-8"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        投票する
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 投票済み表示 */}
            {userHasVoted && !showResults && (
              <Card className="mb-6">
                <CardContent className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 bg-emerald-100 border border-emerald-200">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">投票ありがとうございました！</h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                    あなたの投票が記録されました
                  </p>
                  <div className="text-sm text-stone-500">
                    <strong>あなたの投票:</strong>
                    <br />
                    {poll.options
                      .filter(opt => userVoteOptions.includes(opt.id))
                      .map(opt => `• ${opt.text}`)
                      .join('\n')}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 結果表示エリア */}
            {showResults || !canVote ? (
              <div className="space-y-6">
                {/* グラフ表示 */}
                <VoteChart vote={poll} />

                {/* 詳細結果 */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>詳細結果</CardTitle>
                      <Button variant="ghost" size="sm" onClick={refreshResults} title="結果を更新">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <VoteResults
                      options={poll.options}
                      totalVotes={poll.totalVotes}
                      userSelectedOptions={userVoteOptions}
                      _allowMultiple={poll.allowMultiple}
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8 text-stone-500">
                  投票後に結果が表示されます
                </CardContent>
              </Card>
            )}
          </div>

          {/* サイドバー - 1カラム分 */}
          <div className="space-y-6">
            {/* 投票統計 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">投票統計</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600 dark:text-stone-400">総投票数</span>
                    <span className="font-semibold">{poll.totalVotes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600 dark:text-stone-400">選択肢数</span>
                    <span className="font-semibold">{poll.options.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600 dark:text-stone-400">投票方式</span>
                    <span className="text-sm font-medium">
                      {poll.allowMultiple ? '複数選択' : '単一選択'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 時間情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">時間情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600 dark:text-stone-400">作成日時</span>
                    <span className="text-sm font-medium">
                      {new Date(poll.createdAt).toLocaleDateString('ja-JP')}{' '}
                      {new Date(poll.createdAt).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600 dark:text-stone-400">終了予定</span>
                    <span className="text-sm font-medium">
                      {poll.expiresAt
                        ? `${new Date(poll.expiresAt).toLocaleDateString('ja-JP')} ${new Date(poll.expiresAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
                        : '未設定'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600 dark:text-stone-400">残り時間</span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isExpired ? 'text-red-600' : 'text-emerald-600',
                      )}
                    >
                      {isExpired ? '終了済み' : '投票中'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* リアルタイム状態 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">リアルタイム更新</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <RealtimeStatus showReconnectButton={true} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600 dark:text-stone-400">自動更新</span>
                    <span className="text-sm font-medium">{isConnected ? '有効' : '無効'}</span>
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    他のユーザーの投票結果がリアルタイムで反映されます
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 投票確認モーダル */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-blue-100 border border-blue-200 mx-auto">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-center">投票を確定しますか？</DialogTitle>
            <DialogDescription className="text-center">
              選択した内容で投票を行います。
            </DialogDescription>
          </DialogHeader>
          <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg my-4">
            <strong className="text-sm">選択した項目:</strong>
            <div className="mt-1 text-sm">
              {poll.options
                .filter(opt => selectedOptions.includes(opt.id))
                .map(opt => (
                  <div key={opt.id}>• {opt.text}</div>
                ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              キャンセル
            </Button>
            <Button onClick={confirmVote} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  投票中...
                </>
              ) : (
                '投票する'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
