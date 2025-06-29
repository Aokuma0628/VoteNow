// リアルタイム更新をすべてのクライアントに送信するためのグローバル管理

// EventSourceのクライアントを管理するSet
const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

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
  clients.forEach(controller => {
    try {
      controller.enqueue(encoded);
    } catch {
      // 接続が切れたクライアントを削除
      clients.delete(controller);
    }
  });
}

// クライアントを追加する関数
export function addClient(controller: ReadableStreamDefaultController<Uint8Array>) {
  clients.add(controller);
}

// クライアントを削除する関数
export function removeClient(controller: ReadableStreamDefaultController<Uint8Array>) {
  clients.delete(controller);
}

// 接続されているクライアント数を取得
export function getClientCount(): number {
  return clients.size;
}
