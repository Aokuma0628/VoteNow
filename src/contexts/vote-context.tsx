'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Vote, VoteOption, VoteRecord, UserVoteHistory, VoteCategoryId, VOTE_STATUS } from '@/types/vote';
import { mockVotes, userVoteHistory as initialUserHistory } from '@/lib/mock-data';

interface VoteContextType {
  // 状態
  votes: Vote[];
  userVoteHistory: UserVoteHistory;
  
  // 投票CRUD操作
  createVote: (voteData: Omit<Vote, 'id' | 'createdAt' | 'updatedAt' | 'totalVotes'>) => string;
  updateVote: (id: string, updates: Partial<Vote>) => boolean;
  deleteVote: (id: string) => boolean;
  getVote: (id: string) => Vote | undefined;
  
  // 投票参加機能
  castVote: (voteId: string, optionIds: string[]) => boolean;
  hasUserVoted: (voteId: string) => boolean;
  getUserVote: (voteId: string) => string[];
  
  // 選択肢の管理
  addVoteOption: (voteId: string, option: Omit<VoteOption, 'id' | 'votes'>) => boolean;
  removeVoteOption: (voteId: string, optionId: string) => boolean;
  
  // ユーティリティ
  getVotesByCategory: (category: VoteCategoryId) => Vote[];
  getActiveVotes: () => Vote[];
  getVoteStats: () => {
    total: number;
    active: number;
    closed: number;
    totalVotes: number;
  };
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

interface VoteProviderProps {
  children: ReactNode;
}

export function VoteProvider({ children }: VoteProviderProps) {
  const [votes, setVotes] = useState<Vote[]>(mockVotes);
  const [userVoteHistory, setUserVoteHistory] = useState<UserVoteHistory>(initialUserHistory);

  // ID生成用のユーティリティ
  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

  // 投票の作成
  const createVote = useCallback((voteData: Omit<Vote, 'id' | 'createdAt' | 'updatedAt' | 'totalVotes'>) => {
    const id = generateId();
    const now = new Date();
    
    const newVote: Vote = {
      ...voteData,
      id,
      createdAt: now,
      updatedAt: now,
      totalVotes: 0,
      options: voteData.options.map(option => ({
        ...option,
        id: option.id || generateId(),
        votes: 0
      }))
    };

    setVotes(prev => [newVote, ...prev]);
    return id;
  }, [generateId]);

  // 投票の更新
  const updateVote = useCallback((id: string, updates: Partial<Vote>) => {
    setVotes(prev => {
      const index = prev.findIndex(vote => vote.id === id);
      if (index === -1) return prev;

      const updatedVote = {
        ...prev[index],
        ...updates,
        updatedAt: new Date()
      };

      const newVotes = [...prev];
      newVotes[index] = updatedVote;
      return newVotes;
    });
    return true;
  }, []);

  // 投票の削除
  const deleteVote = useCallback((id: string) => {
    setVotes(prev => prev.filter(vote => vote.id !== id));
    
    // ユーザーの投票履歴からも削除
    setUserVoteHistory(prev => ({
      ...prev,
      voteRecords: prev.voteRecords.filter(record => record.voteId !== id)
    }));
    
    return true;
  }, []);

  // 投票の取得
  const getVote = useCallback((id: string) => {
    return votes.find(vote => vote.id === id);
  }, [votes]);

  // 投票に参加
  const castVote = useCallback((voteId: string, optionIds: string[]) => {
    const vote = votes.find(v => v.id === voteId);
    if (!vote || vote.status !== VOTE_STATUS.ACTIVE) return false;

    // 既に投票済みの場合は投票を取り消し
    const existingRecord = userVoteHistory.voteRecords.find(record => record.voteId === voteId);
    
    setVotes(prev => {
      return prev.map(v => {
        if (v.id !== voteId) return v;

        const updatedOptions = v.options.map(option => {
          let newVotes = option.votes;

          // 既存の投票を取り消し
          if (existingRecord) {
            const wasVoted = existingRecord.optionIds?.includes(option.id) || 
                           existingRecord.optionId === option.id;
            if (wasVoted) {
              newVotes = Math.max(0, newVotes - 1);
            }
          }

          // 新しい投票を追加
          if (optionIds.includes(option.id)) {
            newVotes += 1;
          }

          return { ...option, votes: newVotes };
        });

        const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);

        return {
          ...v,
          options: updatedOptions,
          totalVotes,
          updatedAt: new Date()
        };
      });
    });

    // ユーザーの投票履歴を更新
    setUserVoteHistory(prev => {
      const newRecords = prev.voteRecords.filter(record => record.voteId !== voteId);
      
      const newRecord: VoteRecord = {
        voteId,
        ...(optionIds.length === 1 
          ? { optionId: optionIds[0] } 
          : { optionIds }
        ),
        votedAt: new Date()
      };

      return {
        ...prev,
        voteRecords: [...newRecords, newRecord]
      };
    });

    return true;
  }, [votes, userVoteHistory]);

  // ユーザーが投票済みかチェック
  const hasUserVoted = useCallback((voteId: string) => {
    return userVoteHistory.voteRecords.some(record => record.voteId === voteId);
  }, [userVoteHistory]);

  // ユーザーの投票選択肢を取得
  const getUserVote = useCallback((voteId: string) => {
    const record = userVoteHistory.voteRecords.find(record => record.voteId === voteId);
    return record ? (record.optionIds || [record.optionId!]) : [];
  }, [userVoteHistory]);

  // 投票選択肢を追加
  const addVoteOption = useCallback((voteId: string, option: Omit<VoteOption, 'id' | 'votes'>) => {
    const vote = votes.find(v => v.id === voteId);
    if (!vote || !vote.allowAddOptions) return false;

    const newOption: VoteOption = {
      ...option,
      id: generateId(),
      votes: 0
    };

    setVotes(prev => {
      return prev.map(v => {
        if (v.id !== voteId) return v;
        return {
          ...v,
          options: [...v.options, newOption],
          updatedAt: new Date()
        };
      });
    });

    return true;
  }, [votes, generateId]);

  // 投票選択肢を削除
  const removeVoteOption = useCallback((voteId: string, optionId: string) => {
    setVotes(prev => {
      return prev.map(v => {
        if (v.id !== voteId) return v;
        
        const updatedOptions = v.options.filter(opt => opt.id !== optionId);
        const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
        
        return {
          ...v,
          options: updatedOptions,
          totalVotes,
          updatedAt: new Date()
        };
      });
    });

    // ユーザーの投票履歴からも削除された選択肢を除去
    setUserVoteHistory(prev => ({
      ...prev,
      voteRecords: prev.voteRecords.map(record => {
        if (record.voteId !== voteId) return record;
        
        return {
          ...record,
          optionIds: record.optionIds?.filter(id => id !== optionId),
          optionId: record.optionId === optionId ? undefined : record.optionId
        };
      }).filter(record => {
        // 投票選択肢がすべて削除された場合は履歴も削除
        return record.optionId || (record.optionIds && record.optionIds.length > 0);
      })
    }));

    return true;
  }, []);

  // カテゴリ別投票取得
  const getVotesByCategory = useCallback((category: VoteCategoryId) => {
    return votes.filter(vote => vote.category === category);
  }, [votes]);

  // アクティブな投票取得
  const getActiveVotes = useCallback(() => {
    return votes.filter(vote => vote.status === VOTE_STATUS.ACTIVE);
  }, [votes]);

  // 統計情報取得
  const getVoteStats = useCallback(() => {
    const total = votes.length;
    const active = votes.filter(v => v.status === VOTE_STATUS.ACTIVE).length;
    const closed = votes.filter(v => v.status === VOTE_STATUS.CLOSED).length;
    const totalVotes = votes.reduce((sum, vote) => sum + vote.totalVotes, 0);

    return { total, active, closed, totalVotes };
  }, [votes]);

  const value: VoteContextType = {
    votes,
    userVoteHistory,
    createVote,
    updateVote,
    deleteVote,
    getVote,
    castVote,
    hasUserVoted,
    getUserVote,
    addVoteOption,
    removeVoteOption,
    getVotesByCategory,
    getActiveVotes,
    getVoteStats
  };

  return (
    <VoteContext.Provider value={value}>
      {children}
    </VoteContext.Provider>
  );
}

export function useVote() {
  const context = useContext(VoteContext);
  if (context === undefined) {
    throw new Error('useVote must be used within a VoteProvider');
  }
  return context;
}