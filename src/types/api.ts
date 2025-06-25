// API レスポンス共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API エラーレスポンス型
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// 投票一覧取得レスポンス
export interface PollsListResponse extends ApiResponse {
  data: {
    polls: PollWithStats[];
    total: number;
  };
}

// 投票詳細取得レスポンス
export interface PollDetailResponse extends ApiResponse {
  data: PollWithDetails;
}

// 投票作成リクエスト
export interface CreatePollRequest {
  title: string;
  description?: string;
  category: string;
  allowMultiple?: boolean;
  allowAddOptions?: boolean;
  isPublic?: boolean;
  expiresAt?: string; // ISO date string
  options: {
    text: string;
    description?: string;
  }[];
}

// 投票作成レスポンス
export interface CreatePollResponse extends ApiResponse {
  data: PollWithStats;
}

// 投票実行リクエスト
export interface CastVoteRequest {
  optionIds: string[]; // 複数選択対応のため配列
}

// 投票実行レスポンス
export interface CastVoteResponse extends ApiResponse {
  data: {
    votes: VoteWithDetails[];
    poll: PollWithDetails;
  };
}

// 拡張された投票型（統計情報付き）
export interface PollWithStats {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  status: string;
  allowMultiple: boolean;
  allowAddOptions: boolean;
  isPublic: boolean;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  creator: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  options: PollOptionWithVotes[];
  totalVotes: number;
  _count?: {
    votes: number;
  };
}

// 拡張された投票型（詳細情報付き）
export interface PollWithDetails extends PollWithStats {
  votes: VoteWithDetails[];
}

// 投票選択肢（投票数付き）
export interface PollOptionWithVotes {
  id: string;
  text: string;
  description?: string | null;
  votes: VoteWithDetails[];
  _count: {
    votes: number;
  };
}

// 投票履歴（詳細情報付き）
export interface VoteWithDetails {
  id: string;
  userId: string;
  pollId: string;
  optionId: string;
  votedAt: Date;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  option: {
    id: string;
    text: string;
    description?: string | null;
  };
}

// クエリパラメータ型
export interface PollsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}

// HTTPメソッド型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Next.js API Route ハンドラー型
export interface ApiRouteContext {
  params: { [key: string]: string | string[] };
}
