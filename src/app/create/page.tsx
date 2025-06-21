'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Info, List, Settings, Rocket, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { VoteCard } from '@/components/vote-card';
import { AppLayout } from '@/components/layout/app-layout';
import { VOTE_CATEGORIES, type VoteCategoryId, VOTE_STATUS } from '@/types/vote';
import { mockVotes } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FormData {
  title: string;
  description: string;
  category: VoteCategoryId | '';
  options: string[];
  allowMultiple: boolean;
  allowAddOptions: boolean;
  isPublic: boolean;
  expiresAt: string;
}

interface ValidationErrors {
  title?: string;
  category?: string;
  options?: string;
}

export default function CreatePage() {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<FormData>(() => ({
    title: '',
    description: '',
    category: '',
    options: ['', ''],
    allowMultiple: false,
    allowAddOptions: false,
    isPublic: true,
    expiresAt: '',
  }));

  const [errors, setErrors] = useState<ValidationErrors>({});

  // バリデーション
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // タイトル検証
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'タイトルは3文字以上入力してください';
    } else if (formData.title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください';
    }

    // カテゴリ検証
    if (!formData.category) {
      newErrors.category = 'カテゴリを選択してください';
    }

    // 選択肢検証
    const validOptions = formData.options.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      newErrors.options = '有効な選択肢を最低2個入力してください';
    } else {
      // 重複チェック
      const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
      if (uniqueOptions.size !== validOptions.length) {
        newErrors.options = '選択肢に重複があります';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title, formData.category, formData.options]);

  // 選択肢追加
  const addOption = useCallback(() => {
    if (formData.options.length >= 10) {
      toast.warning('選択肢は最大10個までです');
      return;
    }
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  }, [formData.options.length]);

  // 選択肢削除
  const removeOption = useCallback(
    (index: number) => {
      if (formData.options.length <= 2) {
        toast.warning('選択肢は最低2個必要です');
        return;
      }
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    },
    [formData.options.length],
  );

  // 選択肢更新
  const updateOption = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }));
  }, []);

  // フォーム送信
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error('入力内容を確認してください');
        return;
      }

      try {
        const validOptions = formData.options.filter(opt => opt.trim().length > 0);

        // モック投票作成
        const newVote = {
          id: `vote-${Date.now()}`,
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          category: formData.category as VoteCategoryId,
          status: VOTE_STATUS.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
          createdBy: {
            id: 'current-user',
            name: '現在のユーザー',
            avatar: null,
          },
          options: validOptions.map((text, index) => ({
            id: `opt-${Date.now()}-${index}`,
            text: text.trim(),
            votes: 0,
          })),
          totalVotes: 0,
          allowMultiple: formData.allowMultiple,
          allowAddOptions: formData.allowAddOptions,
          isPublic: formData.isPublic,
        };

        // モックデータに追加（実際の実装では API コール）
        mockVotes.unshift(newVote);

        toast.success('投票を作成しました！');

        // ホームページにリダイレクト
        router.push('/');
      } catch (error) {
        console.error('Error creating vote:', error);
        toast.error('投票の作成に失敗しました');
      }
    },
    [formData, validateForm, router],
  );

  // プレビュー用の投票データをメモ化
  const previewVote = useMemo(
    () => ({
      id: 'preview',
      title: formData.title || '投票タイトル',
      description: formData.description || undefined,
      category: (formData.category as VoteCategoryId) || 'other',
      status: VOTE_STATUS.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: formData.expiresAt
        ? new Date(formData.expiresAt)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: {
        id: 'current-user',
        name: '現在のユーザー',
        avatar: null,
      },
      options: formData.options
        .filter(opt => opt.trim().length > 0)
        .map((text, index) => ({
          id: `preview-opt-${index}`,
          text: text.trim(),
          votes: 0,
        })),
      totalVotes: 0,
      allowMultiple: formData.allowMultiple,
      allowAddOptions: formData.allowAddOptions,
      isPublic: formData.isPublic,
    }),
    [formData],
  );

  // バリデーション状態をメモ化
  const isFormValid = useMemo(() => {
    const hasTitle = formData.title.trim().length >= 3 && formData.title.length <= 100;
    const hasCategory = !!formData.category;
    const validOptions = formData.options.filter(opt => opt.trim().length > 0);
    const hasValidOptions = validOptions.length >= 2;
    const hasUniqueOptions =
      new Set(validOptions.map(opt => opt.trim().toLowerCase())).size === validOptions.length;

    return hasTitle && hasCategory && hasValidOptions && hasUniqueOptions;
  }, [formData.title, formData.category, formData.options]);

  if (showPreview) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              編集に戻る
            </Button>
            <h1 className="text-2xl font-bold">プレビュー</h1>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              <Rocket className="h-4 w-4 mr-2" />
              投票を作成
            </Button>
          </div>

          <div className="max-w-md mx-auto">
            <VoteCard vote={previewVote} hasVoted={false} onShare={() => {}} />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">新しい投票を作成</h1>
          <p className="text-stone-600 dark:text-stone-400">
            みんなの意見を集めて、より良い決断をしましょう
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報セクション */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-emerald-600" />
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* タイトル */}
                <div>
                  <Label htmlFor="title">
                    投票タイトル <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="例：好きなプログラミング言語"
                    maxLength={100}
                    className={cn(errors.title && 'border-red-500')}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.title && <span className="text-sm text-red-600">{errors.title}</span>}
                    <span className="text-xs text-stone-500 ml-auto">
                      {formData.title.length}/100文字
                    </span>
                  </div>
                </div>

                {/* 説明 */}
                <div>
                  <Label htmlFor="description">説明（任意）</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="投票の詳細や注意事項があれば..."
                    maxLength={500}
                    rows={3}
                  />
                  <div className="text-xs text-stone-500 text-right mt-1">
                    {formData.description.length}/500文字
                  </div>
                </div>

                {/* カテゴリ */}
                <div>
                  <Label>
                    カテゴリ <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: VoteCategoryId) =>
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className={cn(errors.category && 'border-red-500')}>
                      <SelectValue placeholder="カテゴリを選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(VOTE_CATEGORIES).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.emoji} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <span className="text-sm text-red-600">{errors.category}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 選択肢セクション */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-emerald-600" />
                  選択肢
                  <span className="text-sm font-normal text-stone-500">（最低2つ、最大10個）</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={e => updateOption(index, e.target.value)}
                        placeholder={`選択肢 ${index + 1}`}
                        maxLength={100}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        disabled={formData.options.length <= 2}
                        className="text-stone-400 hover:text-red-600"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  disabled={formData.options.length >= 10}
                  className="w-full border-2 border-dashed border-stone-300 hover:border-stone-400 text-stone-600 hover:text-stone-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  選択肢を追加
                </Button>

                {errors.options && <span className="text-sm text-red-600">{errors.options}</span>}
              </CardContent>
            </Card>

            {/* 設定セクション */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  投票設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 投票方式 */}
                <div>
                  <Label className="text-base">投票方式</Label>
                  <RadioGroup
                    value={formData.allowMultiple ? 'multiple' : 'single'}
                    onValueChange={value =>
                      setFormData(prev => ({ ...prev, allowMultiple: value === 'multiple' }))
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2 p-3 border border-stone-200 rounded-md">
                      <RadioGroupItem value="single" id="single" />
                      <div>
                        <Label htmlFor="single" className="font-medium">
                          単一選択
                        </Label>
                        <div className="text-sm text-stone-600">1つの選択肢のみ選択可能</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-stone-200 rounded-md">
                      <RadioGroupItem value="multiple" id="multiple" />
                      <div>
                        <Label htmlFor="multiple" className="font-medium">
                          複数選択
                        </Label>
                        <div className="text-sm text-stone-600">複数の選択肢を選択可能</div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* 期限設定 */}
                <div>
                  <Label htmlFor="expires">投票期限</Label>
                  <Input
                    id="expires"
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={e => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    placeholder="yyyy-MM-dd HH:mm"
                    className="mt-1"
                  />
                  <div className="text-xs text-stone-500 mt-1">
                    未設定の場合は1週間後に自動設定されます
                  </div>
                </div>

                {/* オプション設定 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowAddOptions" className="font-medium">
                        選択肢の追加を許可
                      </Label>
                      <div className="text-sm text-stone-600">
                        投票者が新しい選択肢を追加できるようにします
                      </div>
                    </div>
                    <Switch
                      id="allowAddOptions"
                      checked={formData.allowAddOptions}
                      onCheckedChange={checked =>
                        setFormData(prev => ({ ...prev, allowAddOptions: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPublic" className="font-medium">
                        公開投票
                      </Label>
                      <div className="text-sm text-stone-600">
                        誰でも投票に参加できるようにします
                      </div>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={checked =>
                        setFormData(prev => ({ ...prev, isPublic: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* アクションボタン */}
            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={!isFormValid}
              >
                <Eye className="h-4 w-4 mr-2" />
                プレビュー
              </Button>
              <Button type="submit" disabled={!isFormValid}>
                <Rocket className="h-4 w-4 mr-2" />
                投票を作成
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
