/**
 * VoteNow投票アプリケーション - モックデータ
 */

import { Vote, VOTE_STATUS, UserVoteHistory, TimeRemaining, VoteStats } from '@/types/vote';

// モック投票データ
export const mockVotes: Vote[] = [
  {
    id: '1',
    title: '好きなプログラミング言語',
    description: 'チーム開発で最も使いたいプログラミング言語を選んでください',
    category: 'work',
    status: VOTE_STATUS.ACTIVE,
    createdAt: new Date('2024-12-01T10:00:00'),
    updatedAt: new Date('2024-12-06T14:30:00'),
    expiresAt: new Date('2024-12-15T23:59:59'),
    createdBy: {
      id: 'user1',
      name: '田中太郎',
      avatar: null,
    },
    options: [
      {
        id: 'opt1',
        text: 'TypeScript',
        description: '型安全性とモダンな開発体験',
        votes: 45,
      },
      {
        id: 'opt2',
        text: 'Python',
        description: 'シンプルで読みやすいコード',
        votes: 32,
      },
      {
        id: 'opt3',
        text: 'Go',
        description: '高性能でシンプルな言語',
        votes: 18,
      },
      {
        id: 'opt4',
        text: 'Rust',
        description: 'メモリ安全性と高性能',
        votes: 12,
      },
    ],
    totalVotes: 107,
    allowMultiple: false,
    allowAddOptions: false,
    isPublic: true,
  },
  {
    id: '2',
    title: '来週のランチミーティング場所',
    description: 'チーム全体でのランチミーティングを行う場所を決めましょう',
    category: 'food',
    status: VOTE_STATUS.ACTIVE,
    createdAt: new Date('2024-12-05T09:15:00'),
    updatedAt: new Date('2024-12-06T12:00:00'),
    expiresAt: new Date('2024-12-08T17:00:00'),
    createdBy: {
      id: 'user2',
      name: '佐藤花子',
      avatar: null,
    },
    options: [
      {
        id: 'opt5',
        text: 'イタリアンレストラン',
        description: '駅前の人気店、パスタが美味しい',
        votes: 8,
      },
      {
        id: 'opt6',
        text: '和食レストラン',
        description: '落ち着いた雰囲気、定食メニュー豊富',
        votes: 12,
      },
      {
        id: 'opt7',
        text: 'カフェレストラン',
        description: 'カジュアルな雰囲気、軽食メニュー',
        votes: 6,
      },
      {
        id: 'opt8',
        text: 'オフィス近くのフードコート',
        description: '選択肢豊富、価格リーズナブル',
        votes: 4,
      },
    ],
    totalVotes: 30,
    allowMultiple: false,
    allowAddOptions: true,
    isPublic: true,
  },
  {
    id: '3',
    title: '年末パーティーの開催日程',
    description: '今年の年末パーティーの日程を決めましょう。都合の良い日をお選びください',
    category: 'event',
    status: VOTE_STATUS.ACTIVE,
    createdAt: new Date('2024-11-20T16:30:00'),
    updatedAt: new Date('2024-12-03T10:15:00'),
    expiresAt: new Date('2024-12-10T23:59:59'),
    createdBy: {
      id: 'user3',
      name: '山田次郎',
      avatar: null,
    },
    options: [
      {
        id: 'opt9',
        text: '12月20日（金）',
        description: '仕事納め前の金曜日',
        votes: 23,
      },
      {
        id: 'opt10',
        text: '12月21日（土）',
        description: '週末でゆっくり楽しめる',
        votes: 31,
      },
      {
        id: 'opt11',
        text: '12月22日（日）',
        description: '日曜日の午後から',
        votes: 15,
      },
    ],
    totalVotes: 69,
    allowMultiple: false,
    allowAddOptions: false,
    isPublic: true,
  },
  {
    id: '4',
    title: 'リモートワークの頻度について',
    description: '来年度のリモートワーク制度について、希望する頻度をお聞かせください',
    category: 'work',
    status: VOTE_STATUS.CLOSED,
    createdAt: new Date('2024-11-01T14:00:00'),
    updatedAt: new Date('2024-11-30T23:59:59'),
    expiresAt: new Date('2024-11-30T23:59:59'),
    createdBy: {
      id: 'user4',
      name: '鈴木一郎',
      avatar: null,
    },
    options: [
      {
        id: 'opt12',
        text: '週1日',
        description: 'たまにリモートで集中作業',
        votes: 8,
      },
      {
        id: 'opt13',
        text: '週2-3日',
        description: 'バランス良く出社とリモート',
        votes: 24,
      },
      {
        id: 'opt14',
        text: '週4-5日',
        description: 'ほぼリモート、必要時のみ出社',
        votes: 12,
      },
      {
        id: 'opt15',
        text: '完全リモート',
        description: '基本的に出社不要',
        votes: 3,
      },
    ],
    totalVotes: 47,
    allowMultiple: false,
    allowAddOptions: false,
    isPublic: true,
  },
  {
    id: '5',
    title: '新しいオフィス環境の改善案',
    description: 'より良い職場環境のために改善したい項目を選んでください（複数選択可）',
    category: 'work',
    status: VOTE_STATUS.ACTIVE,
    createdAt: new Date('2024-12-02T11:00:00'),
    updatedAt: new Date('2024-12-06T09:30:00'),
    expiresAt: new Date('2024-12-20T17:00:00'),
    createdBy: {
      id: 'user5',
      name: '高橋美咲',
      avatar: null,
    },
    options: [
      {
        id: 'opt16',
        text: '休憩スペースの充実',
        description: 'リラックスできる空間の拡張',
        votes: 28,
      },
      {
        id: 'opt17',
        text: 'モニターの追加',
        description: 'デュアルモニター環境の整備',
        votes: 35,
      },
      {
        id: 'opt18',
        text: '会議室の増設',
        description: 'オンライン会議用の個室ブース',
        votes: 22,
      },
      {
        id: 'opt19',
        text: '空調システム改善',
        description: '快適な温度管理システム',
        votes: 19,
      },
      {
        id: 'opt20',
        text: 'カフェコーナー設置',
        description: '軽食と飲み物を楽しめるスペース',
        votes: 26,
      },
    ],
    totalVotes: 130,
    allowMultiple: true,
    allowAddOptions: true,
    isPublic: true,
  },
];

// ユーザーの投票履歴（デモ用）
export const userVoteHistory: UserVoteHistory = {
  userId: 'current-user',
  voteRecords: [
    {
      voteId: '1',
      optionId: 'opt1',
      votedAt: new Date('2024-12-03T15:30:00'),
    },
    {
      voteId: '4',
      optionId: 'opt13',
      votedAt: new Date('2024-11-15T10:20:00'),
    },
    {
      voteId: '5',
      optionIds: ['opt16', 'opt17', 'opt20'],
      votedAt: new Date('2024-12-04T14:45:00'),
    },
  ],
};

// ユーティリティ関数
export const VoteUtils = {
  // 投票の残り時間を計算
  getTimeRemaining(vote: Vote): TimeRemaining {
    if (vote.status === VOTE_STATUS.CLOSED) return { expired: true };

    const now = new Date();
    const expires = new Date(vote.expiresAt || vote.createdAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return { expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
  },

  // 投票率を計算
  getVotePercentage(option: { votes: number }, totalVotes: number): number {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes / totalVotes) * 100);
  },

  // ユーザーが投票済みかチェック
  hasUserVoted(voteId: string): boolean {
    return userVoteHistory.voteRecords.some(record => record.voteId === voteId);
  },

  // ユーザーの投票選択肢を取得
  getUserVote(voteId: string): string[] {
    const record = userVoteHistory.voteRecords.find(record => record.voteId === voteId);
    return record ? record.optionIds || [record.optionId!] : [];
  },

  // 投票データを投票数順でソート
  sortOptionsByVotes(options: { votes: number }[], descending = true) {
    return [...options].sort((a, b) => (descending ? b.votes - a.votes : a.votes - b.votes));
  },

  // 投票をカテゴリ別にグループ化
  groupVotesByCategory(votes: Vote[]) {
    return votes.reduce(
      (groups, vote) => {
        const category = vote.category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(vote);
        return groups;
      },
      {} as Record<string, Vote[]>,
    );
  },

  // アクティブな投票のみをフィルタ
  getActiveVotes(votes: Vote[]): Vote[] {
    return votes.filter(vote => vote.status === VOTE_STATUS.ACTIVE);
  },

  // 投票の統計情報を計算
  getVoteStats(votes: Vote[]): VoteStats {
    const total = votes.length;
    const active = votes.filter(v => v.status === VOTE_STATUS.ACTIVE).length;
    const closed = votes.filter(v => v.status === VOTE_STATUS.CLOSED).length;
    const totalVotes = votes.reduce((sum, vote) => sum + vote.totalVotes, 0);

    return { total, active, closed, totalVotes };
  },

  // 時間フォーマット
  formatTimeRemaining(timeObj: TimeRemaining): string {
    if (timeObj.expired) return '期限切れ';

    const { days, hours, minutes } = timeObj;

    if (days && days > 0) {
      return `残り${days}日${hours && hours > 0 ? hours + '時間' : ''}`;
    } else if (hours && hours > 0) {
      return `残り${hours}時間${minutes && minutes > 0 ? minutes + '分' : ''}`;
    } else if (minutes && minutes > 0) {
      return `残り${minutes}分`;
    } else {
      return '間もなく終了';
    }
  },

  // 日付フォーマット
  formatDate(
    date: Date,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ): string {
    return new Date(date).toLocaleDateString('ja-JP', options);
  },
};
