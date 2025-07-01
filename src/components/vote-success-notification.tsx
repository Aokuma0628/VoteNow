'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, PartyPopper, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteSuccessNotificationProps {
  show: boolean;
  onComplete?: () => void;
}

export function VoteSuccessNotification({ show, onComplete }: VoteSuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState(0); // 0: 初期, 1: 表示, 2: 完了

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setStage(1);

      // アニメーションのタイミング制御
      const timer1 = setTimeout(() => {
        setStage(2);
      }, 500);

      const timer2 = setTimeout(() => {
        setIsVisible(false);
        setStage(0);
        onComplete?.();
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* 背景のオーバーレイ */}
      <div
        className={cn(
          'absolute inset-0 bg-black/20 transition-opacity duration-500',
          stage >= 1 ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* メインコンテンツ */}
      <div
        className={cn(
          'relative bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4',
          'transform transition-all duration-500 ease-out',
          stage >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        )}
      >
        {/* アイコンコンテナ */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* 背景の円 */}
            <div
              className={cn(
                'absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full',
                'transform transition-all duration-700 ease-out',
                stage >= 2 ? 'scale-110' : 'scale-0',
              )}
            />

            {/* チェックアイコン */}
            <CheckCircle
              className={cn(
                'relative h-20 w-20 text-green-600 dark:text-green-400',
                'transform transition-all duration-500 ease-out',
                stage >= 1 ? 'scale-100 rotate-0' : 'scale-0 rotate-180',
              )}
            />

            {/* 装飾的なアイコン */}
            <Sparkles
              className={cn(
                'absolute -top-2 -right-2 h-8 w-8 text-yellow-500',
                'transform transition-all duration-700 ease-out delay-300',
                stage >= 2 ? 'scale-100 rotate-12' : 'scale-0 rotate-0',
              )}
            />
            <PartyPopper
              className={cn(
                'absolute -bottom-2 -left-2 h-8 w-8 text-purple-500',
                'transform transition-all duration-700 ease-out delay-400',
                stage >= 2 ? 'scale-100 -rotate-12' : 'scale-0 rotate-0',
              )}
            />
          </div>
        </div>

        {/* テキスト */}
        <div className="text-center">
          <h3
            className={cn(
              'text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2',
              'transform transition-all duration-500 ease-out delay-200',
              stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
          >
            投票が完了しました！
          </h3>
          <p
            className={cn(
              'text-stone-600 dark:text-stone-400',
              'transform transition-all duration-500 ease-out delay-300',
              stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
          >
            ご参加ありがとうございました
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mt-6 h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full bg-green-600 dark:bg-green-400 rounded-full',
              'transition-all duration-2500 ease-linear',
              stage >= 1 ? 'w-full' : 'w-0',
            )}
          />
        </div>
      </div>
    </div>
  );
}
