'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Eye, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { VOTE_CATEGORIES, VoteCategoryId, VOTE_STATUS } from '@/types/vote';
import { cn } from '@/lib/utils';

// フォームデータの型定義
interface VoteFormData {
  title: string;
  description: string;
  category: VoteCategoryId;
  options: string[];
  allowMultiple: boolean;
  allowAddOptions: boolean;
  isPublic: boolean;
}

// バリデーションエラーの型定義
interface ValidationErrors {
  title?: string;
  description?: string;
  category?: string;
  options?: string;
}

export default function CreateVotePage() {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // フォームデータの状態管理
  const [formData, setFormData] = useState<VoteFormData>({
    title: '',
    description: '',
    category: 'other',
    options: ['', ''],
    allowMultiple: false,
    allowAddOptions: false,
    isPublic: true,
  });

  // バリデーションエラーの状態管理
  const [errors, setErrors] = useState<ValidationErrors>({});

  // フォームバリデーション
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // タイトルのバリデーション
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'タイトルは3文字以上で入力してください';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください';
    }

    // 説明のバリデーション
    if (formData.description.trim().length > 500) {
      newErrors.description = '説明は500文字以内で入力してください';
    }

    // 選択肢のバリデーション
    const validOptions = formData.options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      newErrors.options = '選択肢は2つ以上必要です';
    } else if (validOptions.length > 10) {
      newErrors.options = '選択肢は10個以下にしてください';
    } else {
      // 重複チェック
      const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
      if (uniqueOptions.size !== validOptions.length) {
        newErrors.options = '選択肢に重複があります';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 選択肢の追加
  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  // 選択肢の削除
  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  // 選択肢の更新
  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  // カテゴリの更新
  const updateCategory = (category: VoteCategoryId) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // モック投票作成処理（実際のAPIコールに置き換え）
      const newVote = {
        id: `vote-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        status: VOTE_STATUS.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7日後
        createdBy: {
          id: 'current-user',
          name: '現在のユーザー',
          avatar: null,
        },
        options: formData.options
          .filter(option => option.trim() !== '')
          .map((option, index) => ({
            id: `opt-${Date.now()}-${index}`,
            text: option.trim(),
            votes: 0,
          })),
        totalVotes: 0,
        allowMultiple: formData.allowMultiple,
        allowAddOptions: formData.allowAddOptions,
        isPublic: formData.isPublic,
      };

      // デモ用のディレイ
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('新しい投票が作成されました:', newVote);
      
      // ホームページにリダイレクト
      router.push('/');
      
    } catch (error) {
      console.error('投票の作成に失敗しました:', error);
      // エラーハンドリング（実際のアプリではエラーメッセージを表示）
    } finally {
      setIsSubmitting(false);
    }
  };

  // プレビュー表示の切り替え
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // 戻るボタンの処理
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50 dark:from-gray-900 dark:via-stone-900 dark:to-slate-900 text-stone-800 dark:text-stone-200">
      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200">
                新しい投票を作成
              </h1>
              <p className="text-stone-600 dark:text-stone-400 mt-1">
                みんなの意見を集めるための投票を作成しましょう
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={togglePreview}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'フォームに戻る' : 'プレビュー'}
            </Button>
          </div>
        </div>

        {showPreview ? (
          // プレビュー表示
          <PreviewSection formData={formData} onBack={() => setShowPreview(false)} />
        ) : (
          // フォーム表示
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 基本情報 */}
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* タイトル */}
                <div className="space-y-2">
                  <Label htmlFor="title">投票タイトル *</Label>
                  <Input
                    id="title"
                    placeholder="例: 来月のチームランチ場所を決めよう"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={cn(errors.title && 'border-red-500')}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* 説明 */}
                <div className="space-y-2">
                  <Label htmlFor="description">説明（任意）</Label>
                  <Textarea
                    id="description"
                    placeholder="投票についての詳細な説明を入力してください..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={cn(errors.description && 'border-red-500')}
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* カテゴリ */}
                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(VOTE_CATEGORIES).map(([key, category]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateCategory(key as VoteCategoryId)}
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-2 rounded-md border transition-colors',
                          formData.category === key
                            ? category.color.light + ' dark:' + category.color.dark
                            : 'border-stone-200 hover:border-stone-300 dark:border-stone-700 dark:hover:border-stone-600'
                        )}
                      >
                        <span>{category.emoji}</span>
                        <span className="text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* 選択肢 */}
            <Card>
              <CardHeader>
                <CardTitle>選択肢</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder={`選択肢 ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={formData.options.length <= 2}
                      className="shrink-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {errors.options && (
                  <p className="text-sm text-red-500">{errors.options}</p>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  disabled={formData.options.length >= 10}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  選択肢を追加 ({formData.options.length}/10)
                </Button>

              </CardContent>
            </Card>

            {/* 設定 */}
            <Card>
              <CardHeader>
                <CardTitle>投票設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowMultiple"
                    checked={formData.allowMultiple}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, allowMultiple: checked as boolean }))
                    }
                  />
                  <Label htmlFor="allowMultiple">複数選択を許可する</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowAddOptions"
                    checked={formData.allowAddOptions}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, allowAddOptions: checked as boolean }))
                    }
                  />
                  <Label htmlFor="allowAddOptions">投票者が選択肢を追加できるようにする</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isPublic: checked as boolean }))
                    }
                  />
                  <Label htmlFor="isPublic">投票を公開する</Label>
                </div>

              </CardContent>
            </Card>

            {/* 送信ボタン */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  <>処理中...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    投票を作成
                  </>
                )}
              </Button>
            </div>

          </form>
        )}

      </main>
    </div>
  );
}

// プレビューセクションのコンポーネント
interface PreviewSectionProps {
  formData: VoteFormData;
  onBack: () => void;
}

function PreviewSection({ formData, onBack }: PreviewSectionProps) {
  const category = VOTE_CATEGORIES[formData.category];
  const validOptions = formData.options.filter(option => option.trim() !== '');

  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>プレビュー</span>
            <Button variant="outline" onClick={onBack} size="sm">
              編集に戻る
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          {/* カテゴリバッジ */}
          <div className="mb-4">
            <Badge
              variant="secondary"
              className={cn(
                'gap-1',
                category.color.light,
                'dark:' + category.color.dark
              )}
            >
              <span>{category.emoji}</span>
              {category.name}
            </Badge>
          </div>

          {/* タイトル */}
          <h2 className="text-2xl font-bold mb-3 text-stone-800 dark:text-stone-200">
            {formData.title || 'タイトルが入力されていません'}
          </h2>

          {/* 説明 */}
          {formData.description && (
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              {formData.description}
            </p>
          )}

          {/* 選択肢 */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-lg">選択肢</h3>
            {validOptions.length > 0 ? (
              validOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <input
                    type={formData.allowMultiple ? 'checkbox' : 'radio'}
                    name="vote-preview"
                    disabled
                    className="w-4 h-4"
                  />
                  <span className="text-stone-700 dark:text-stone-300">
                    {option}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-stone-500 dark:text-stone-400 italic">
                選択肢が入力されていません
              </p>
            )}
          </div>

          {/* 設定情報 */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">設定</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">複数選択:</span>
                <span>{formData.allowMultiple ? '許可' : '許可しない'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">選択肢追加:</span>
                <span>{formData.allowAddOptions ? '許可' : '許可しない'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">公開設定:</span>
                <span>{formData.isPublic ? '公開' : '非公開'}</span>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}