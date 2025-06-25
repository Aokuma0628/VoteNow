import { useEffect, useRef, useCallback, useState } from 'react';
import { mutate } from 'swr';

// リアルタイムイベントの型定義
export interface RealtimeEvent {
  type: 'connection' | 'poll_created' | 'vote_cast' | 'poll_updated';
  pollId?: string;
  data?: unknown;
  timestamp: string;
  message?: string;
}

// 接続状態の型定義
export interface ConnectionStatus {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  error?: string;
  lastConnect?: Date;
  retryCount: number;
}

// リアルタイム接続フック
export function useRealtime() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'disconnected',
    retryCount: 0,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const maxRetries = 5;
  const baseRetryDelay = 1000; // 1秒

  // イベントハンドラー
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data: RealtimeEvent = JSON.parse(event.data);

      // データのリアルタイム更新
      switch (data.type) {
        case 'connection':
          console.log('✅ リアルタイム接続が確立されました');
          setConnectionStatus(prev => ({
            ...prev,
            status: 'connected',
            lastConnect: new Date(),
            error: undefined,
          }));
          reconnectAttemptsRef.current = 0;
          break;

        case 'poll_created':
          console.log('📊 新しい投票が作成されました:', data.pollId);
          // 投票一覧のキャッシュを更新
          mutate('/api/polls');
          break;

        case 'vote_cast':
          console.log('🗳️ 投票が実行されました:', data.pollId);
          if (data.pollId) {
            // 投票詳細のキャッシュを更新
            mutate(`/api/polls/${data.pollId}`);
            // 投票一覧も更新（統計が変わる可能性があるため）
            mutate('/api/polls');
          }
          break;

        case 'poll_updated':
          console.log('🔄 投票が更新されました:', data.pollId);
          if (data.pollId) {
            mutate(`/api/polls/${data.pollId}`);
            mutate('/api/polls');
          }
          break;

        default:
          console.log('📨 リアルタイムイベント受信:', data);
      }
    } catch (error) {
      console.error('❌ リアルタイムイベントの処理エラー:', error);
    }
  }, []);

  const handleOpen = useCallback(() => {
    console.log('🔗 EventSource接続が開かれました');
    setConnectionStatus(prev => ({
      ...prev,
      status: 'connected',
      lastConnect: new Date(),
      error: undefined,
    }));
    reconnectAttemptsRef.current = 0;
  }, []);

  const handleError = useCallback(
    (event: Event) => {
      console.error('❌ EventSource接続エラー:', event);
      const target = event.target as EventSource;

      if (target.readyState === EventSource.CLOSED) {
        setConnectionStatus(prev => ({
          ...prev,
          status: 'disconnected',
          error: 'Connection closed',
          retryCount: reconnectAttemptsRef.current,
        }));

        // 自動再接続ロジック
        if (reconnectAttemptsRef.current < maxRetries) {
          const delay = baseRetryDelay * Math.pow(2, reconnectAttemptsRef.current);
          console.log(
            `🔄 ${delay}ms後に再接続を試行します (${reconnectAttemptsRef.current + 1}/${maxRetries})`,
          );

          retryTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            setConnectionStatus(prev => ({ ...prev, status: 'connecting' }));

            const eventSource = new EventSource('/api/events');
            eventSource.addEventListener('message', handleMessage);
            eventSource.addEventListener('open', handleOpen);
            eventSource.addEventListener('error', handleError);
            eventSourceRef.current = eventSource;
          }, delay);
        } else {
          console.error('❌ 最大再試行回数に達しました。手動で再接続してください。');
          setConnectionStatus(prev => ({
            ...prev,
            status: 'error',
            error: 'Max retries exceeded',
          }));
        }
      }
    },
    [handleMessage, handleOpen],
  );

  // 接続開始
  const connect = useCallback(() => {
    // 既存の接続があれば閉じる
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // タイムアウトをクリア
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    try {
      setConnectionStatus(prev => ({ ...prev, status: 'connecting' }));

      const eventSource = new EventSource('/api/events');
      eventSource.addEventListener('message', handleMessage);
      eventSource.addEventListener('open', handleOpen);
      eventSource.addEventListener('error', handleError);

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('❌ EventSource接続の初期化に失敗:', error);
      setConnectionStatus(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  }, [handleMessage, handleOpen, handleError]);

  // 接続終了
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setConnectionStatus(prev => ({
      ...prev,
      status: 'disconnected',
      error: undefined,
    }));

    reconnectAttemptsRef.current = 0;
    console.log('🔌 リアルタイム接続を終了しました');
  }, []);

  // 手動再接続
  const reconnect = useCallback(() => {
    console.log('🔄 手動再接続を開始します');
    reconnectAttemptsRef.current = 0;

    // 既存の接続があれば閉じる
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // タイムアウトをクリア
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    try {
      setConnectionStatus(prev => ({ ...prev, status: 'connecting' }));

      const eventSource = new EventSource('/api/events');
      eventSource.addEventListener('message', handleMessage);
      eventSource.addEventListener('open', handleOpen);
      eventSource.addEventListener('error', handleError);

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('❌ EventSource接続の初期化に失敗:', error);
      setConnectionStatus(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  }, [handleMessage, handleOpen, handleError]);

  // コンポーネントのマウント/アンマウント時の処理
  useEffect(() => {
    // 初回接続を実行
    const initConnect = () => {
      try {
        setConnectionStatus(prev => ({ ...prev, status: 'connecting' }));

        const eventSource = new EventSource('/api/events');
        eventSource.addEventListener('message', handleMessage);
        eventSource.addEventListener('open', handleOpen);
        eventSource.addEventListener('error', handleError);

        eventSourceRef.current = eventSource;
      } catch (error) {
        console.error('❌ EventSource接続の初期化に失敗:', error);
        setConnectionStatus(prev => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Connection failed',
        }));
      }
    };

    initConnect();

    return () => {
      disconnect();
    };
  }, [handleMessage, handleOpen, handleError, disconnect]);

  return {
    connectionStatus,
    connect,
    disconnect,
    reconnect,
  };
}

// 特定の投票のリアルタイム監視フック
export function useRealtimePoll(pollId: string | null) {
  const { connectionStatus } = useRealtime();

  // 投票の変更を監視するためのSWRキーを生成
  const swrKey = pollId ? `/api/polls/${pollId}` : null;

  return {
    connectionStatus,
    isConnected: connectionStatus.status === 'connected',
    swrKey,
  };
}
