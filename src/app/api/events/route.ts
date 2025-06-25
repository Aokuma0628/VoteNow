import { NextRequest } from 'next/server';

// EventSourceのCloseイベント用のグローバル変数
const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

// Server-Sent Eventsのエンドポイント
export async function GET(request: NextRequest) {
  // CORS ヘッダーを設定
  const responseHeaders = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // ReadableStreamを作成してSSE接続を管理
  const stream = new ReadableStream({
    start(controller) {
      // クライアントを追加
      clients.add(controller);

      // 接続確認メッセージを送信
      const connectionData = JSON.stringify({
        type: 'connection',
        message: 'Connected to realtime updates',
        timestamp: new Date().toISOString(),
      });

      controller.enqueue(
        new TextEncoder().encode(`data: ${connectionData}\n\n`)
      );

      // クライアントが切断されたときの処理
      request.signal.addEventListener('abort', () => {
        clients.delete(controller);
        try {
          controller.close();
        } catch (error) {
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

// リアルタイム更新をすべてのクライアントに送信する関数
export function broadcastUpdate(data: {
  type: 'poll_created' | 'vote_cast' | 'poll_updated';
  pollId?: string;
  data?: unknown;
}) {
  const message = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  });

  const encoded = new TextEncoder().encode(`data: ${message}\n\n`);

  // すべての接続されたクライアントに送信
  clients.forEach((controller) => {
    try {
      controller.enqueue(encoded);
    } catch (error) {
      // 接続が切れたクライアントを削除
      clients.delete(controller);
    }
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