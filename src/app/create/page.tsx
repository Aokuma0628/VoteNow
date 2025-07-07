'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Info, List, Settings, Rocket, Loader2 } from 'lucide-react';
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
import { AppLayout } from '@/components/layout/app-layout';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createPoll } from '@/lib/hooks/use-polls';
import type { CreatePollRequest } from '@/types/api';

// カテゴリの型定義（API対応）
type CategoryType = 'general' | 'work' | 'event' | 'poll' | 'other';

interface FormData {
  title: string;
  description: string;
  category: CategoryType | '';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      setIsSubmitting(true);

      try {
        const validOptions = formData.options.filter(opt => opt.trim().length > 0);

        // API用のリクエストデータを作成
        const pollData: CreatePollRequest = {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          category: formData.category as CategoryType,
          allowMultiple: formData.allowMultiple,
          allowAddOptions: formData.allowAddOptions,
          isPublic: formData.isPublic,
          expiresAt: formData.expiresAt ? formData.expiresAt : undefined,
          options: validOptions.map(text => ({
            text: text.trim(),
            description: undefined,
          })),
        };

        // API経由で投票を作成
        const response = await createPoll(pollData);

        toast.success('投票を作成しました！');

        // 作成した投票の詳細ページにリダイレクト
        router.push(`/vote/${response.data.id}`);
      } catch (error) {
        console.error('Error creating poll:', error);
        const errorMessage = error instanceof Error ? error.message : '投票の作成に失敗しました';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, router],
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
                    onValueChange={(value: CategoryType) =>
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className={cn(errors.category && 'border-red-500')}>
                      <SelectValue placeholder="カテゴリを選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">📊 一般</SelectItem>
                      <SelectItem value="work">💼 仕事</SelectItem>
                      <SelectItem value="event">🎉 イベント</SelectItem>
                      <SelectItem value="poll">🗳️ アンケート</SelectItem>
                      <SelectItem value="other">📋 その他</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <span className="text-sm text-red-600">{errors.category}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 選択肢セクション */}
            <fieldset>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" id="options-title">
                    <List className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                    選択肢
                    <span className="text-sm font-normal text-stone-500">
                      （最低2つ、最大10個）
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3" role="group" aria-labelledby="options-title">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          id={`option-${index}`}
                          value={option}
                          onChange={e => updateOption(index, e.target.value)}
                          placeholder={`選択肢 ${index + 1}`}
                          maxLength={100}
                          className="flex-1"
                          aria-label={`選択肢 ${index + 1}`}
                          aria-describedby={`option-help-${index}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          disabled={formData.options.length <= 2}
                          className="text-stone-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-label={`選択肢 ${index + 1} を削除`}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <span id={`option-help-${index}`} className="sr-only">
                          最大100文字まで入力可能
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    disabled={formData.options.length >= 10}
                    className="w-full border-2 border-dashed border-stone-300 hover:border-stone-400 text-stone-600 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-describedby="add-option-help"
                  >
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                    選択肢を追加
                  </Button>
                  <span id="add-option-help" className="sr-only">
                    選択肢は最大10個まで追加できます
                  </span>

                  {errors.options && (
                    <span className="text-sm text-red-600" role="alert" aria-live="polite">
                      {errors.options}
                    </span>
                  )}
                </CardContent>
              </Card>
            </fieldset>

            {/* 設定セクション */}
            <fieldset>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" id="settings-title">
                    <Settings className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                    投票設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 投票方式 */}
                  <div>
                    <Label className="text-base" id="vote-type-label">
                      投票方式
                    </Label>
                    <RadioGroup
                      value={formData.allowMultiple ? 'multiple' : 'single'}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, allowMultiple: value === 'multiple' }))
                      }
                      className="mt-2"
                      aria-labelledby="vote-type-label"
                    >
                      <div className="flex items-center space-x-2 p-3 border border-stone-200 dark:border-stone-700 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
                        <RadioGroupItem value="single" id="single" />
                        <div>
                          <Label htmlFor="single" className="font-medium cursor-pointer">
                            単一選択
                          </Label>
                          <div className="text-sm text-stone-600">1つの選択肢のみ選択可能</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-stone-200 dark:border-stone-700 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
                        <RadioGroupItem value="multiple" id="multiple" />
                        <div>
                          <Label htmlFor="multiple" className="font-medium cursor-pointer">
                            複数選択
                          </Label>
                          <div className="text-sm text-stone-600">複数の選択肢を選択可能</div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 期限設定 */}
                  <div>
                    <Label htmlFor="expires">投票期限（任意）</Label>
                    <Input
                      id="expires"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={e => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                      placeholder="yyyy-MM-dd HH:mm"
                      className="mt-1"
                      aria-describedby="expires-help"
                    />
                    <div id="expires-help" className="text-xs text-stone-500 mt-1">
                      未設定の場合は1週間後に自動設定されます
                    </div>
                  </div>

                  {/* オプション設定 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-700 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
                      <div>
                        <Label htmlFor="allowAddOptions" className="font-medium cursor-pointer">
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
                        aria-describedby="allowAddOptions-desc"
                      />
                      <span id="allowAddOptions-desc" className="sr-only">
                        現在{formData.allowAddOptions ? '有効' : '無効'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-700 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
                      <div>
                        <Label htmlFor="isPublic" className="font-medium cursor-pointer">
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
                        aria-describedby="isPublic-desc"
                      />
                      <span id="isPublic-desc" className="sr-only">
                        現在{formData.isPublic ? '有効' : '無効'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </fieldset>

            {/* アクションボタン */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-describedby={!isFormValid ? 'form-validation-status' : undefined}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    <span aria-live="polite">作成中...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" aria-hidden="true" />
                    投票を作成
                  </>
                )}
              </Button>
            </div>
            {!isFormValid && (
              <div id="form-validation-status" className="sr-only" role="status" aria-live="polite">
                フォームに不備があります。必須項目を確認してください。
              </div>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
