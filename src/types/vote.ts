/**
 * VoteNow投票アプリケーション - 型定義
 */

// 投票ステータス
export const VOTE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
} as const;

export type VoteStatus = (typeof VOTE_STATUS)[keyof typeof VOTE_STATUS];

// 投票カテゴリ
export const VOTE_CATEGORIES = {
  work: {
    id: 'work',
    name: '仕事',
    emoji: '💼',
    color: {
      light: 'bg-blue-100 text-blue-700 border-blue-200',
      dark: 'bg-blue-900/30 text-blue-400 border-blue-800/30',
    },
  },
  lifestyle: {
    id: 'lifestyle',
    name: 'ライフスタイル',
    emoji: '🏠',
    color: {
      light: 'bg-green-100 text-green-700 border-green-200',
      dark: 'bg-green-900/30 text-green-400 border-green-800/30',
    },
  },
  food: {
    id: 'food',
    name: '食事',
    emoji: '🍽️',
    color: {
      light: 'bg-orange-100 text-orange-700 border-orange-200',
      dark: 'bg-orange-900/30 text-orange-400 border-orange-800/30',
    },
  },
  event: {
    id: 'event',
    name: 'イベント',
    emoji: '🎉',
    color: {
      light: 'bg-purple-100 text-purple-700 border-purple-200',
      dark: 'bg-purple-900/30 text-purple-400 border-purple-800/30',
    },
  },
  other: {
    id: 'other',
    name: 'その他',
    emoji: '📝',
    color: {
      light: 'bg-gray-100 text-gray-700 border-gray-200',
      dark: 'bg-gray-900/30 text-gray-400 border-gray-800/30',
    },
  },
} as const;

export type VoteCategoryId = keyof typeof VOTE_CATEGORIES;

export interface VoteCategory {
  id: VoteCategoryId;
  name: string;
  emoji: string;
  color: {
    light: string;
    dark: string;
  };
}

// ユーザー
export interface User {
  id: string;
  name: string;
  avatar: string | null;
}

// 投票選択肢
export interface VoteOption {
  id: string;
  text: string;
  description?: string;
  votes: number;
}

// 投票
export interface Vote {
  id: string;
  title: string;
  description?: string;
  category: VoteCategoryId;
  status: VoteStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  createdBy: User;
  options: VoteOption[];
  totalVotes: number;
  allowMultiple: boolean;
  allowAddOptions: boolean;
  isPublic: boolean;
}

// 投票履歴
export interface VoteRecord {
  voteId: string;
  optionId?: string;
  optionIds?: string[];
  votedAt: Date;
}

export interface UserVoteHistory {
  userId: string;
  voteRecords: VoteRecord[];
}

// 時間情報
export interface TimeRemaining {
  days?: number;
  hours?: number;
  minutes?: number;
  expired: boolean;
}

// 投票統計
export interface VoteStats {
  total: number;
  active: number;
  closed: number;
  totalVotes: number;
}

// ユーティリティ型
export type VoteWithCategory = Vote & {
  categoryInfo: VoteCategory;
};
