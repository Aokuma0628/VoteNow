import { SWRConfiguration } from 'swr';

// フェッチャー関数の定義
export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    // エラーレスポンスの場合はJSON形式で詳細を取得
    const errorData = await response.json().catch(() => ({
      error: 'Network error',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));

    const error = new Error(errorData.message || 'An error occurred');
    (error as Error & { info?: unknown; status?: number }).info = errorData;
    (error as Error & { info?: unknown; status?: number }).status = response.status;
    throw error;
  }

  return response.json();
};

// SWRのグローバル設定
export const swrConfig: SWRConfiguration = {
  fetcher,
  // データの再検証設定
  revalidateOnFocus: false, // フォーカス時の再検証を無効
  revalidateOnReconnect: true, // 再接続時の再検証を有効
  dedupingInterval: 2000, // 2秒間の重複リクエスト防止
  errorRetryCount: 3, // エラー時の再試行回数
  errorRetryInterval: 5000, // 再試行間隔（5秒）
  shouldRetryOnError: error => {
    // 4xx系エラーは再試行しない
    return error.status >= 500;
  },
  onError: (error, key) => {
    console.error('SWR Error:', { key, error });
    // エラートラッキングサービスがあれば、ここに追加
  },
};

// API レスポンス型定義のためのヘルパー
export interface SWRResponse<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => void;
}
