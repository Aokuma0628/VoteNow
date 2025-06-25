import { NextRequest } from 'next/server';
import { addClient, removeClient } from '@/lib/realtime';

// Server-Sent Eventsのエンドポイント
export async function GET(request: NextRequest) {
  // CORS ヘッダーを設定
  const responseHeaders = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // ReadableStreamを作成してSSE接続を管理
  const stream = new ReadableStream({
    start(controller) {
      // クライアントを追加
      addClient(controller);

      // 接続確認メッセージを送信
      const connectionData = JSON.stringify({
        type: 'connection',
        message: 'Connected to realtime updates',
        timestamp: new Date().toISOString(),
      });

      controller.enqueue(new TextEncoder().encode(`data: ${connectionData}\n\n`));

      // クライアントが切断されたときの処理
      request.signal.addEventListener('abort', () => {
        removeClient(controller);
        try {
          controller.close();
        } catch {
          // 既に閉じられている場合のエラーを無視
        }
      });
    },
    cancel() {
      // ストリームがキャンセルされた時の処理
    },
  });

  return new Response(stream, {
    headers: responseHeaders,
  });
}

// OPTIONS リクエストのサポート（CORS対応）
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
