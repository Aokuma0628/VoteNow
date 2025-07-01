import { NextRequest } from 'next/server';
import { pollOperations, statsOperations } from '@/lib/database';
import {
  createNotFoundError,
  createMethodNotAllowedError,
  createServerError,
} from '@/lib/api-utils';

// GET /api/polls/[id]/export - 投票結果のエクスポート
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    if (typeof id !== 'string') {
      return createNotFoundError('投票');
    }

    // 投票の存在確認と詳細取得
    const poll = await pollOperations.findById(id);
    if (!poll) {
      return createNotFoundError('投票');
    }

    // 投票統計の取得
    const stats = await statsOperations.getPollVoteStats(id);

    // エクスポート用データの準備
    const exportData = {
      poll: {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        category: poll.category,
        status: poll.status,
        createdAt: poll.createdAt,
        updatedAt: poll.updatedAt,
        expiresAt: poll.expiresAt,
        creator: poll.creator.name,
      },
      statistics: {
        totalVotes: stats.totalVotes,
        optionCounts: stats.optionCounts,
      },
      options: poll.options.map(option => ({
        id: option.id,
        text: option.text,
        description: option.description,
        voteCount: option.votes.length,
        percentage:
          stats.totalVotes > 0
            ? ((option.votes.length / stats.totalVotes) * 100).toFixed(2)
            : '0.00',
      })),
      votes: poll.votes.map(vote => ({
        id: vote.id,
        userId: vote.userId,
        userName: vote.user.name,
        optionId: vote.optionId,
        optionText: vote.option.text,
        votedAt: vote.votedAt,
      })),
    };

    // フォーマットに応じてレスポンスを返す
    if (format === 'csv') {
      return generateCSVResponse(exportData);
    } else {
      // デフォルトはJSON
      return new Response(JSON.stringify(exportData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="poll-${id}-export.json"`,
        },
      });
    }
  } catch (error) {
    console.error('GET /api/polls/[id]/export Error:', error);
    return createServerError();
  }
}

// エクスポートデータの型定義
interface ExportData {
  poll: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
    creator: string;
  };
  statistics: {
    totalVotes: number;
    optionCounts: Record<string, number>;
  };
  options: Array<{
    id: string;
    text: string;
    description: string | null;
    voteCount: number;
    percentage: string;
  }>;
  votes: Array<{
    id: string;
    userId: string;
    userName: string;
    optionId: string;
    optionText: string;
    votedAt: Date;
  }>;
}

// CSV形式でのレスポンス生成
function generateCSVResponse(data: ExportData): Response {
  const csvLines: string[] = [];

  // ヘッダー情報
  csvLines.push('投票情報');
  csvLines.push(`タイトル,${data.poll.title}`);
  csvLines.push(`説明,${data.poll.description || ''}`);
  csvLines.push(`カテゴリ,${data.poll.category}`);
  csvLines.push(`ステータス,${data.poll.status}`);
  csvLines.push(`作成者,${data.poll.creator}`);
  csvLines.push(`作成日時,${data.poll.createdAt}`);
  csvLines.push(`更新日時,${data.poll.updatedAt}`);
  csvLines.push(`有効期限,${data.poll.expiresAt || ''}`);
  csvLines.push('');

  // 統計情報
  csvLines.push('統計情報');
  csvLines.push(`総投票数,${data.statistics.totalVotes}`);
  csvLines.push('');

  // 選択肢別結果
  csvLines.push('選択肢別結果');
  csvLines.push('選択肢,投票数,割合(%)');
  data.options.forEach(option => {
    csvLines.push(`"${option.text}",${option.voteCount},${option.percentage}`);
  });
  csvLines.push('');

  // 投票履歴
  csvLines.push('投票履歴');
  csvLines.push('投票ID,ユーザー名,選択肢,投票日時');
  data.votes.forEach(vote => {
    csvLines.push(`${vote.id},"${vote.userName}","${vote.optionText}",${vote.votedAt}`);
  });

  const csvContent = csvLines.join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="poll-${data.poll.id}-export.csv"`,
    },
  });
}

// 他のHTTPメソッドは許可しない
export async function POST() {
  return createMethodNotAllowedError(['GET']);
}

export async function PUT() {
  return createMethodNotAllowedError(['GET']);
}

export async function DELETE() {
  return createMethodNotAllowedError(['GET']);
}

export async function PATCH() {
  return createMethodNotAllowedError(['GET']);
}
