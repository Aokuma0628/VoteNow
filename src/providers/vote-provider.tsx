'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Vote, VoteCategoryId, VOTE_STATUS } from '@/types/vote';

interface VoteContextType {
  votes: Vote[];
  addVote: (vote: Omit<Vote, 'id' | 'createdAt' | 'updatedAt'>) => Vote;
  updateVote: (id: string, updates: Partial<Vote>) => void;
  deleteVote: (id: string) => void;
  getVote: (id: string) => Vote | undefined;
  castVote: (voteId: string, optionIds: string[]) => void;
  getUserVotes: (voteId: string) => string[];
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

interface VoteProviderProps {
  children: React.ReactNode;
}

// 各投票に対するユーザーの投票履歴を管理
interface UserVoteRecord {
  [voteId: string]: string[]; // 投票ID -> 選択したオプションIDの配列
}

export function VoteProvider({ children }: VoteProviderProps) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [userVotes, setUserVotes] = useState<UserVoteRecord>({});

  // 投票を追加
  const addVote = useCallback((voteData: Omit<Vote, 'id' | 'createdAt' | 'updatedAt'>): Vote => {
    const newVote: Vote = {
      ...voteData,
      id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setVotes((prev) => [newVote, ...prev]);
    return newVote;
  }, []);

  // 投票を更新
  const updateVote = useCallback((id: string, updates: Partial<Vote>) => {
    setVotes((prev) =>
      prev.map((vote) =>
        vote.id === id
          ? {
              ...vote,
              ...updates,
              updatedAt: new Date(),
            }
          : vote
      )
    );
  }, []);

  // 投票を削除
  const deleteVote = useCallback((id: string) => {
    setVotes((prev) => prev.filter((vote) => vote.id !== id));
    // ユーザーの投票履歴も削除
    setUserVotes((prev) => {
      const newRecord = { ...prev };
      delete newRecord[id];
      return newRecord;
    });
  }, []);

  // 特定の投票を取得
  const getVote = useCallback(
    (id: string): Vote | undefined => {
      return votes.find((vote) => vote.id === id);
    },
    [votes]
  );

  // 投票を実行
  const castVote = useCallback((voteId: string, optionIds: string[]) => {
    const vote = votes.find((v) => v.id === voteId);
    if (!vote) return;

    // ユーザーの以前の投票を取得
    const previousVotes = userVotes[voteId] || [];

    // 投票数を更新
    setVotes((prev) =>
      prev.map((v) => {
        if (v.id !== voteId) return v;

        const updatedOptions = v.options.map((option) => {
          let newVotes = option.votes;

          // 以前の投票から削除
          if (previousVotes.includes(option.id)) {
            newVotes = Math.max(0, newVotes - 1);
          }

          // 新しい投票を追加
          if (optionIds.includes(option.id)) {
            newVotes += 1;
          }

          return { ...option, votes: newVotes };
        });

        // 総投票数を再計算
        const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);

        return {
          ...v,
          options: updatedOptions,
          totalVotes,
          updatedAt: new Date(),
        };
      })
    );

    // ユーザーの投票履歴を更新
    setUserVotes((prev) => ({
      ...prev,
      [voteId]: optionIds,
    }));
  }, [votes, userVotes]);

  // ユーザーの投票履歴を取得
  const getUserVotes = useCallback(
    (voteId: string): string[] => {
      return userVotes[voteId] || [];
    },
    [userVotes]
  );

  const value = useMemo(
    () => ({
      votes,
      addVote,
      updateVote,
      deleteVote,
      getVote,
      castVote,
      getUserVotes,
    }),
    [votes, addVote, updateVote, deleteVote, getVote, castVote, getUserVotes]
  );

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
}

export function useVotes() {
  const context = useContext(VoteContext);
  if (context === undefined) {
    throw new Error('useVotes must be used within a VoteProvider');
  }
  return context;
}