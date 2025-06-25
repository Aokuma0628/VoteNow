import useSWR from 'swr';
import type {
  PollsListResponse,
  PollDetailResponse,
  CreatePollRequest,
  CreatePollResponse,
  CastVoteRequest,
  CastVoteResponse,
} from '@/types/api';
import { fetcher } from '../swr-config';

// 投票一覧取得フック
export function usePolls() {
  const { data, error, isLoading, mutate } = useSWR<PollsListResponse>('/api/polls', fetcher);

  return {
    polls: data?.data?.polls || [],
    total: data?.data?.total || 0,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// 投票詳細取得フック
export function usePoll(id: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR<PollDetailResponse>(
    id ? `/api/polls/${id}` : null,
    fetcher,
  );

  return {
    poll: data?.data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// 投票作成関数
export async function createPoll(pollData: CreatePollRequest): Promise<CreatePollResponse> {
  const response = await fetch('/api/polls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pollData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Network error',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Failed to create poll');
  }

  return response.json();
}

// 投票実行関数
export async function castVote(
  pollId: string,
  voteData: CastVoteRequest,
): Promise<CastVoteResponse> {
  const response = await fetch(`/api/polls/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voteData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Network error',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Failed to cast vote');
  }

  return response.json();
}
