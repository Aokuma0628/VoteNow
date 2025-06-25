'use client';

import { Circle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRealtime, type ConnectionStatus } from '@/lib/hooks/use-realtime';

interface RealtimeStatusProps {
  className?: string;
  showReconnectButton?: boolean;
}

export function RealtimeStatus({ className, showReconnectButton = true }: RealtimeStatusProps) {
  const { connectionStatus, reconnect } = useRealtime();

  // 接続状態に応じたスタイルとアイコンを決定
  const getStatusStyles = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connecting':
        return {
          icon: RefreshCw,
          iconClass: 'text-yellow-500 animate-spin',
          dotClass: 'bg-yellow-500',
          text: '接続中...',
          textClass: 'text-yellow-700 dark:text-yellow-400',
        };
      case 'connected':
        return {
          icon: Wifi,
          iconClass: 'text-green-500',
          dotClass: 'bg-green-500',
          text: 'リアルタイム更新中',
          textClass: 'text-green-700 dark:text-green-400',
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          iconClass: 'text-gray-500',
          dotClass: 'bg-gray-500',
          text: '接続なし',
          textClass: 'text-gray-700 dark:text-gray-400',
        };
      case 'error':
        return {
          icon: WifiOff,
          iconClass: 'text-red-500',
          dotClass: 'bg-red-500',
          text: '接続エラー',
          textClass: 'text-red-700 dark:text-red-400',
        };
      default:
        return {
          icon: WifiOff,
          iconClass: 'text-gray-500',
          dotClass: 'bg-gray-500',
          text: '不明',
          textClass: 'text-gray-700 dark:text-gray-400',
        };
    }
  };

  const styles = getStatusStyles(connectionStatus.status);
  const IconComponent = styles.icon;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* 接続状態のドット */}
      <div className="relative flex items-center">
        <Circle className={cn('h-2 w-2', styles.dotClass)} fill="currentColor" />
        {connectionStatus.status === 'connected' && (
          <Circle
            className="absolute h-2 w-2 bg-green-500 animate-ping"
            fill="currentColor"
          />
        )}
      </div>

      {/* アイコンとテキスト */}
      <div className="flex items-center gap-1">
        <IconComponent className={cn('h-4 w-4', styles.iconClass)} />
        <span className={cn('text-sm font-medium', styles.textClass)}>
          {styles.text}
        </span>
      </div>

      {/* 再試行回数の表示 */}
      {connectionStatus.retryCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          (再試行: {connectionStatus.retryCount})
        </span>
      )}

      {/* 再接続ボタン */}
      {showReconnectButton && 
       (connectionStatus.status === 'error' || connectionStatus.status === 'disconnected') && (
        <Button
          variant="outline"
          size="sm"
          onClick={reconnect}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          再接続
        </Button>
      )}

      {/* 最後の接続時刻 */}
      {connectionStatus.lastConnect && (
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
          最終接続: {connectionStatus.lastConnect.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

// シンプルなドットのみの状態表示
interface RealtimeStatusDotProps {
  className?: string;
}

export function RealtimeStatusDot({ className }: RealtimeStatusDotProps) {
  const { connectionStatus } = useRealtime();
  const styles = getStatusStyles(connectionStatus.status);

  return (
    <div className={cn('relative flex items-center', className)}>
      <Circle className={cn('h-2 w-2', styles.dotClass)} fill="currentColor" />
      {connectionStatus.status === 'connected' && (
        <Circle
          className="absolute h-2 w-2 bg-green-500 animate-ping"
          fill="currentColor"
        />
      )}
    </div>
  );
}

// 接続状態に応じたスタイルを取得するヘルパー関数
function getStatusStyles(status: ConnectionStatus['status']) {
  switch (status) {
    case 'connecting':
      return {
        dotClass: 'text-yellow-500',
        textClass: 'text-yellow-700 dark:text-yellow-400',
      };
    case 'connected':
      return {
        dotClass: 'text-green-500',
        textClass: 'text-green-700 dark:text-green-400',
      };
    case 'disconnected':
      return {
        dotClass: 'text-gray-500',
        textClass: 'text-gray-700 dark:text-gray-400',
      };
    case 'error':
      return {
        dotClass: 'text-red-500',
        textClass: 'text-red-700 dark:text-red-400',
      };
    default:
      return {
        dotClass: 'text-gray-500',
        textClass: 'text-gray-700 dark:text-gray-400',
      };
  }
}