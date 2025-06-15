/**
 * VoteNow投票アプリ - モックデータ
 * 投票機能の全画面表示用のテストデータ
 */

// 投票ステータス定義
const POLL_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed'
};

// 投票カテゴリ定義
const POLL_CATEGORIES = {
  work: {
    id: 'work',
    name: '仕事',
    emoji: '💼',
    color: {
      light: 'bg-blue-100 text-blue-700 border-blue-200',
      dark: 'bg-blue-900/30 text-blue-400 border-blue-800/30'
    }
  },
  lifestyle: {
    id: 'lifestyle',
    name: 'ライフスタイル',
    emoji: '🏠',
    color: {
      light: 'bg-green-100 text-green-700 border-green-200',
      dark: 'bg-green-900/30 text-green-400 border-green-800/30'
    }
  },
  food: {
    id: 'food',
    name: '食事',
    emoji: '🍽️',
    color: {
      light: 'bg-orange-100 text-orange-700 border-orange-200',
      dark: 'bg-orange-900/30 text-orange-400 border-orange-800/30'
    }
  },
  event: {
    id: 'event',
    name: 'イベント',
    emoji: '🎉',
    color: {
      light: 'bg-purple-100 text-purple-700 border-purple-200',
      dark: 'bg-purple-900/30 text-purple-400 border-purple-800/30'
    }
  },
  other: {
    id: 'other',
    name: 'その他',
    emoji: '📝',
    color: {
      light: 'bg-gray-100 text-gray-700 border-gray-200',
      dark: 'bg-gray-900/30 text-gray-400 border-gray-800/30'
    }
  }
};

// モック投票データ
const mockPolls = [
  {
    id: '1',
    title: '好きなプログラミング言語',
    description: 'チーム開発で最も使いたいプログラミング言語を選んでください',
    category: 'work',
    status: POLL_STATUS.ACTIVE,
    createdAt: new Date('2024-12-01T10:00:00'),
    updatedAt: new Date('2024-12-06T14:30:00'),
    expiresAt: new Date('2024-12-15T23:59:59'),
    createdBy: {
      id: 'user1',
      name: '田中太郎',
      avatar: null
    },
    options: [
      {
        id: 'opt1',
        text: 'TypeScript',
        description: '型安全性とモダンな開発体験',
        votes: 45
      },
      {
        id: 'opt2',
        text: 'Python',
        description: 'シンプルで読みやすいコード',
        votes: 32
      },
      {
        id: 'opt3',
        text: 'Go',
        description: '高性能でシンプルな言語',
        votes: 18
      },
      {
        id: 'opt4',
        text: 'Rust',
        description: 'メモリ安全性と高性能',
        votes: 12
      }
    ],
    totalVotes: 107,
    allowMultiple: false,
    allowAddOptions: false,
    isPublic: true
  },
  {
    id: '2',
    title: '来週のランチミーティング場所',
    description: 'チーム全体でのランチミーティングを行う場所を決めましょう',
    category: 'food',
    status: POLL_STATUS.ACTIVE,
    createdAt: new Date('2024-12-05T09:15:00'),
    updatedAt: new Date('2024-12-06T12:00:00'),
    expiresAt: new Date('2024-12-08T17:00:00'),
    createdBy: {
      id: 'user2',
      name: '佐藤花子',
      avatar: null
    },
    options: [
      {
        id: 'opt5',
        text: 'イタリアンレストラン',
        description: '駅前の人気店、パスタが美味しい',
        votes: 8
      },
      {
        id: 'opt6',
        text: '和食レストラン',
        description: '落ち着いた雰囲気、定食メニュー豊富',
        votes: 12
      },
      {
        id: 'opt7',
        text: 'カフェレストラン',
        description: 'カジュアルな雰囲気、軽食メニュー',
        votes: 6
      },
      {
        id: 'opt8',
        text: 'オフィス近くのフードコート',
        description: '選択肢豊富、価格リーズナブル',
        votes: 4
      }
    ],
    totalVotes: 30,
    allowMultiple: false,
    allowAddOptions: true,
    isPublic: true
  },
  {
    id: '3',
    title: '年末パーティーの開催日程',
    description: '今年の年末パーティーの日程を決めましょう。都合の良い日をお選びください',
    category: 'event',
    status: POLL_STATUS.ACTIVE,
    createdAt: new Date('2024-11-20T16:30:00'),
    updatedAt: new Date('2024-12-03T10:15:00'),
    expiresAt: new Date('2024-12-10T23:59:59'),
    createdBy: {
      id: 'user3',
      name: '山田次郎',
      avatar: null
    },
    options: [
      {
        id: 'opt9',
        text: '12月20日（金）',
        description: '仕事納め前の金曜日',
        votes: 23
      },
      {
        id: 'opt10',
        text: '12月21日（土）',
        description: '週末でゆっくり楽しめる',
        votes: 31
      },
      {
        id: 'opt11',
        text: '12月22日（日）',
        description: '日曜日の午後から',
        votes: 15
      }
    ],
    totalVotes: 69,
    allowMultiple: false,
    allowAddOptions: false,
    isPublic: true
  },
  {
    id: '4',
    title: 'リモートワークの頻度について',
    description: '来年度のリモートワーク制度について、希望する頻度をお聞かせください',
    category: 'work',
    status: POLL_STATUS.CLOSED,
    createdAt: new Date('2024-11-01T14:00:00'),
    updatedAt: new Date('2024-11-30T23:59:59'),
    expiresAt: new Date('2024-11-30T23:59:59'),
    createdBy: {
      id: 'user4',
      name: '鈴木一郎',
      avatar: null
    },
    options: [
      {
        id: 'opt12',
        text: '週1日',
        description: 'たまにリモートで集中作業',
        votes: 8
      },
      {
        id: 'opt13',
        text: '週2-3日',
        description: 'バランス良く出社とリモート',
        votes: 24
      },
      {
        id: 'opt14',
        text: '週4-5日',
        description: 'ほぼリモート、必要時のみ出社',
        votes: 12
      },
      {
        id: 'opt15',
        text: '完全リモート',
        description: '基本的に出社不要',
        votes: 3
      }
    ],
    totalVotes: 47,
    allowMultiple: false,
    allowAddOptions: false,
    isPublic: true
  },
  {
    id: '5',
    title: '新しいオフィス環境の改善案',
    description: 'より良い職場環境のために改善したい項目を選んでください（複数選択可）',
    category: 'work',
    status: POLL_STATUS.ACTIVE,
    createdAt: new Date('2024-12-02T11:00:00'),
    updatedAt: new Date('2024-12-06T09:30:00'),
    expiresAt: new Date('2024-12-20T17:00:00'),
    createdBy: {
      id: 'user5',
      name: '高橋美咲',
      avatar: null
    },
    options: [
      {
        id: 'opt16',
        text: '休憩スペースの充実',
        description: 'リラックスできる空間の拡張',
        votes: 28
      },
      {
        id: 'opt17',
        text: 'モニターの追加',
        description: 'デュアルモニター環境の整備',
        votes: 35
      },
      {
        id: 'opt18',
        text: '会議室の増設',
        description: 'オンライン会議用の個室ブース',
        votes: 22
      },
      {
        id: 'opt19',
        text: '空調システム改善',
        description: '快適な温度管理システム',
        votes: 19
      },
      {
        id: 'opt20',
        text: 'カフェコーナー設置',
        description: '軽食と飲み物を楽しめるスペース',
        votes: 26
      }
    ],
    totalVotes: 130,
    allowMultiple: true,
    allowAddOptions: true,
    isPublic: true
  }
];

// ユーザーの投票履歴（デモ用）
const userVoteHistory = {
  userId: 'current-user',
  votes: [
    {
      pollId: '1',
      optionId: 'opt1',
      votedAt: new Date('2024-12-03T15:30:00')
    },
    {
      pollId: '4',
      optionId: 'opt13',
      votedAt: new Date('2024-11-15T10:20:00')
    },
    {
      pollId: '5',
      optionIds: ['opt16', 'opt17', 'opt20'],
      votedAt: new Date('2024-12-04T14:45:00')
    }
  ]
};

// ユーティリティ関数
const PollUtils = {
  // 投票の残り時間を計算
  getTimeRemaining(poll) {
    if (poll.status === POLL_STATUS.CLOSED) return { expired: true };
    
    const now = new Date();
    const expires = new Date(poll.expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return { expired: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes, expired: false };
  },

  // 投票率を計算
  getVotePercentage(option, totalVotes) {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes / totalVotes) * 100);
  },

  // ユーザーが投票済みかチェック
  hasUserVoted(pollId) {
    return userVoteHistory.votes.some(vote => vote.pollId === pollId);
  },

  // ユーザーの投票選択肢を取得
  getUserVote(pollId) {
    const vote = userVoteHistory.votes.find(vote => vote.pollId === pollId);
    return vote ? (vote.optionIds || [vote.optionId]) : [];
  },

  // 投票データを投票数順でソート
  sortOptionsByVotes(options, descending = true) {
    return [...options].sort((a, b) => 
      descending ? b.votes - a.votes : a.votes - b.votes
    );
  },

  // 投票をカテゴリ別にグループ化
  groupPollsByCategory(polls) {
    return polls.reduce((groups, poll) => {
      const category = poll.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(poll);
      return groups;
    }, {});
  },

  // アクティブな投票のみをフィルタ
  getActivePolls(polls) {
    return polls.filter(poll => poll.status === POLL_STATUS.ACTIVE);
  },

  // 投票の統計情報を計算
  getPollStats(polls) {
    const total = polls.length;
    const active = polls.filter(p => p.status === POLL_STATUS.ACTIVE).length;
    const closed = polls.filter(p => p.status === POLL_STATUS.CLOSED).length;
    const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);
    
    return { total, active, closed, totalVotes };
  }
};

// データをグローバル領域で利用可能にする
window.VoteNowData = {
  POLL_STATUS,
  POLL_CATEGORIES,
  mockPolls,
  userVoteHistory,
  PollUtils
};