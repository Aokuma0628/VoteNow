import { prisma } from './prisma';
import type { Poll, PollOption, Vote, User } from '@prisma/client';

// User関連の操作
export const userOperations = {
  // ユーザーを作成
  async create(data: { name: string; avatar?: string }): Promise<User> {
    return prisma.user.create({
      data,
    });
  },

  // ユーザーを取得
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  // 全ユーザーを取得
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  },
};

// Poll関連の操作
export const pollOperations = {
  // 投票を作成
  async create(data: {
    title: string;
    description?: string;
    category: string;
    createdBy: string;
    allowMultiple?: boolean;
    allowAddOptions?: boolean;
    isPublic?: boolean;
    expiresAt?: Date;
    options: { text: string; description?: string }[];
  }): Promise<Poll & { options: PollOption[] }> {
    const { options, ...pollData } = data;

    return prisma.poll.create({
      data: {
        ...pollData,
        options: {
          create: options,
        },
      },
      include: {
        options: true,
      },
    });
  },

  // 投票を取得（選択肢と作成者情報を含む）
  async findById(id: string) {
    return prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            votes: {
              include: {
                user: true,
                option: true,
              },
            },
          },
        },
        creator: true,
        votes: {
          include: {
            user: true,
            option: true,
          },
        },
      },
    });
  },

  // 全投票を取得
  async findAll() {
    return prisma.poll.findMany({
      include: {
        options: {
          include: {
            votes: {
              include: {
                user: true,
                option: true,
              },
            },
          },
        },
        creator: true,
        votes: {
          include: {
            user: true,
            option: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // 投票ステータスを更新
  async updateStatus(id: string, status: string): Promise<Poll> {
    return prisma.poll.update({
      where: { id },
      data: { status },
    });
  },

  // 投票を削除
  async delete(id: string): Promise<Poll> {
    return prisma.poll.delete({
      where: { id },
    });
  },
};

// Vote関連の操作
export const voteOperations = {
  // 投票を行う
  async cast(data: { userId: string; pollId: string; optionId: string }): Promise<Vote> {
    return prisma.vote.create({
      data,
    });
  },

  // ユーザーの投票履歴を取得
  async findByUser(userId: string, pollId?: string): Promise<Vote[]> {
    return prisma.vote.findMany({
      where: {
        userId,
        ...(pollId && { pollId }),
      },
      include: {
        option: true,
        poll: true,
      },
    });
  },

  // 特定の投票に対するユーザーの投票を取得
  async findUserVoteForPoll(userId: string, pollId: string): Promise<Vote[]> {
    return prisma.vote.findMany({
      where: {
        userId,
        pollId,
      },
      include: {
        option: true,
      },
    });
  },

  // 投票を削除（取り消し）
  async delete(userId: string, pollId: string, optionId: string): Promise<Vote> {
    return prisma.vote.delete({
      where: {
        userId_pollId_optionId: {
          userId,
          pollId,
          optionId,
        },
      },
    });
  },
};

// 統計情報を取得
export const statsOperations = {
  // 投票統計を取得
  async getPollStats() {
    const [total, active, closed, totalVotes] = await Promise.all([
      prisma.poll.count(),
      prisma.poll.count({ where: { status: 'active' } }),
      prisma.poll.count({ where: { status: 'closed' } }),
      prisma.vote.count(),
    ]);

    return {
      total,
      active,
      closed,
      totalVotes,
    };
  },

  // 特定の投票の統計を取得
  async getPollVoteStats(pollId: string) {
    const votes = await prisma.vote.findMany({
      where: { pollId },
      include: { option: true },
    });

    const optionCounts = votes.reduce(
      (acc, vote) => {
        acc[vote.optionId] = (acc[vote.optionId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalVotes: votes.length,
      optionCounts,
    };
  },
};
