'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Vote, VOTE_STATUS } from '@/types/vote';

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

// デモ用の初期データ
const createInitialVotes = (): Vote[] => {
  const now = new Date();

  return [
    {
      id: 'vote-demo-1',
      title: '好きなプログラミング言語は？',
      description: 'あなたが最も好きなプログラミング言語を教えてください。',
      category: 'other',
      status: VOTE_STATUS.ACTIVE,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3日前
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4日後
      createdBy: {
        id: 'user-1',
        name: 'Tech太郎',
        avatar: null,
      },
      options: [
        { id: 'opt-1-1', text: 'JavaScript', votes: 42 },
        { id: 'opt-1-2', text: 'Python', votes: 38 },
        { id: 'opt-1-3', text: 'TypeScript', votes: 28 },
        { id: 'opt-1-4', text: 'Java', votes: 15 },
        { id: 'opt-1-5', text: 'Go', votes: 12 },
      ],
      totalVotes: 135,
      allowMultiple: false,
      allowAddOptions: false,
      isPublic: true,
    },
    {
      id: 'vote-demo-2',
      title: '今日のランチは何にする？',
      description: 'チームランチの場所を決めましょう！',
      category: 'food',
      status: VOTE_STATUS.ACTIVE,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2時間前
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1時間前
      expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2時間後
      createdBy: {
        id: 'user-2',
        name: '美食家さん',
        avatar: null,
      },
      options: [
        { id: 'opt-2-1', text: '和食', votes: 8 },
        { id: 'opt-2-2', text: 'イタリアン', votes: 6 },
        { id: 'opt-2-3', text: 'ラーメン', votes: 10 },
        { id: 'opt-2-4', text: 'カレー', votes: 5 },
      ],
      totalVotes: 29,
      allowMultiple: false,
      allowAddOptions: false,
      isPublic: true,
    },
    {
      id: 'vote-demo-3',
      title: 'イベントの開催日程（複数選択可）',
      description: '参加可能な日程をすべて選んでください。',
      category: 'event',
      status: VOTE_STATUS.ACTIVE,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1日前
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6日後
      createdBy: {
        id: 'user-3',
        name: 'イベント担当',
        avatar: null,
      },
      options: [
        { id: 'opt-3-1', text: '12月15日（土）', votes: 12 },
        { id: 'opt-3-2', text: '12月16日（日）', votes: 15 },
        { id: 'opt-3-3', text: '12月22日（土）', votes: 18 },
        { id: 'opt-3-4', text: '12月23日（日）', votes: 20 },
      ],
      totalVotes: 25, // 参加者数
      allowMultiple: true,
      allowAddOptions: false,
      isPublic: true,
    },
  ];
};

export function VoteProvider({ children }: VoteProviderProps) {
  const [votes, setVotes] = useState<Vote[]>(createInitialVotes());
  const [userVotes, setUserVotes] = useState<UserVoteRecord>({});

  // 投票を追加
  const addVote = useCallback((voteData: Omit<Vote, 'id' | 'createdAt' | 'updatedAt'>): Vote => {
    const newVote: Vote = {
      ...voteData,
      id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setVotes(prev => [newVote, ...prev]);
    return newVote;
  }, []);

  // 投票を更新
  const updateVote = useCallback((id: string, updates: Partial<Vote>) => {
    setVotes(prev =>
      prev.map(vote =>
        vote.id === id
          ? {
              ...vote,
              ...updates,
              updatedAt: new Date(),
            }
          : vote,
      ),
    );
  }, []);

  // 投票を削除
  const deleteVote = useCallback((id: string) => {
    setVotes(prev => prev.filter(vote => vote.id !== id));
    // ユーザーの投票履歴も削除
    setUserVotes(prev => {
      const newRecord = { ...prev };
      delete newRecord[id];
      return newRecord;
    });
  }, []);

  // 特定の投票を取得
  const getVote = useCallback(
    (id: string): Vote | undefined => {
      return votes.find(vote => vote.id === id);
    },
    [votes],
  );

  // 投票を実行
  const castVote = useCallback(
    (voteId: string, optionIds: string[]) => {
      const vote = votes.find(v => v.id === voteId);
      if (!vote) return;

      // ユーザーの以前の投票を取得
      const previousVotes = userVotes[voteId] || [];

      // 投票数を更新
      setVotes(prev =>
        prev.map(v => {
          if (v.id !== voteId) return v;

          const updatedOptions = v.options.map(option => {
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
        }),
      );

      // ユーザーの投票履歴を更新
      setUserVotes(prev => ({
        ...prev,
        [voteId]: optionIds,
      }));
    },
    [votes, userVotes],
  );

  // ユーザーの投票履歴を取得
  const getUserVotes = useCallback(
    (voteId: string): string[] => {
      return userVotes[voteId] || [];
    },
    [userVotes],
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
    [votes, addVote, updateVote, deleteVote, getVote, castVote, getUserVotes],
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
