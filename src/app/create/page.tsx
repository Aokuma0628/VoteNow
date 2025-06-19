'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useVote } from '@/contexts/vote-context';
import { VOTE_CATEGORIES, VOTE_STATUS, VoteCategoryId } from '@/types/vote';

interface VoteOptionInput {
  id: string;
  text: string;
  description?: string;
}

export default function CreateVotePage() {
  const router = useRouter();
  const { createVote } = useVote();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VoteCategoryId>('other');
  const [options, setOptions] = useState<VoteOptionInput[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [allowAddOptions, setAllowAddOptions] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [expirationDays, setExpirationDays] = useState(7);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 選択肢を追加
  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([...options, { id: newId, text: '' }]);
  };

  // 選択肢を削除
  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  // 選択肢を更新
  const updateOption = (id: string, field: keyof VoteOptionInput, value: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, [field]: value } : option
    ));
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('投票のタイトルを入力してください');
      return;
    }

    const validOptions = options.filter(option => option.text.trim());
    if (validOptions.length < 2) {
      alert('少なくとも2つの選択肢を入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(now.getDate() + expirationDays);

      const voteId = createVote({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        status: VOTE_STATUS.ACTIVE,
        expiresAt,
        createdBy: {
          id: 'current-user',
          name: '現在のユーザー', // 実際のアプリでは認証システムから取得
          avatar: null
        },
        options: validOptions.map(option => ({
          id: option.id,
          text: option.text.trim(),
          description: option.description?.trim() || undefined,
          votes: 0
        })),
        allowMultiple,
        allowAddOptions,
        isPublic
      });

      router.push(`/vote/${voteId}`);
    } catch (error) {
      console.error('投票作成エラー:', error);
      alert('投票の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50 dark:from-gray-900 dark:via-stone-900 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">新しい投票を作成</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">投票タイトル *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: 好きなプログラミング言語"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">説明（任意）</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="投票の詳細や背景を説明してください"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category">カテゴリ</Label>
                <Select value={category} onValueChange={(value: VoteCategoryId) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VOTE_CATEGORIES).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{cat.emoji}</span>
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expiration">有効期限</Label>
                <Select value={expirationDays.toString()} onValueChange={(value) => setExpirationDays(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1日後</SelectItem>
                    <SelectItem value="3">3日後</SelectItem>
                    <SelectItem value="7">1週間後</SelectItem>
                    <SelectItem value="14">2週間後</SelectItem>
                    <SelectItem value="30">1ヶ月後</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 投票選択肢 */}
          <Card>
            <CardHeader>
              <CardTitle>投票選択肢</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={option.text}
                      onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                      placeholder={`選択肢 ${index + 1}`}
                      required={index < 2}
                    />
                    <Input
                      value={option.description || ''}
                      onChange={(e) => updateOption(option.id, 'description', e.target.value)}
                      placeholder="説明（任意）"
                      className="text-sm"
                    />
                  </div>
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                選択肢を追加
              </Button>
            </CardContent>
          </Card>

          {/* 設定オプション */}
          <Card>
            <CardHeader>
              <CardTitle>投票設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowMultiple">複数選択を許可</Label>
                  <p className="text-sm text-muted-foreground">
                    参加者が複数の選択肢を選べるようになります
                  </p>
                </div>
                <Switch
                  id="allowMultiple"
                  checked={allowMultiple}
                  onCheckedChange={setAllowMultiple}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowAddOptions">選択肢の追加を許可</Label>
                  <p className="text-sm text-muted-foreground">
                    参加者が新しい選択肢を追加できるようになります
                  </p>
                </div>
                <Switch
                  id="allowAddOptions"
                  checked={allowAddOptions}
                  onCheckedChange={setAllowAddOptions}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPublic">公開投票</Label>
                  <p className="text-sm text-muted-foreground">
                    誰でもアクセスできる投票になります
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </CardContent>
          </Card>

          {/* 送信ボタン */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1"
            >
              {isSubmitting ? '作成中...' : '投票を作成'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}