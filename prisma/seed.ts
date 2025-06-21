import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ユーザーデータの作成
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: '田中太郎',
        avatar: null,
      },
    }),
    prisma.user.create({
      data: {
        name: '佐藤花子',
        avatar: null,
      },
    }),
    prisma.user.create({
      data: {
        name: '山田次郎',
        avatar: null,
      },
    }),
  ]);

  console.log('✅ Created users:', users.length);

  // 投票データの作成
  const polls = await Promise.all([
    // 1. プログラミング言語の投票
    prisma.poll.create({
      data: {
        title: '好きなプログラミング言語は？',
        description: 'あなたが最も好きなプログラミング言語を教えてください',
        category: 'work',
        status: 'active',
        allowMultiple: false,
        allowAddOptions: false,
        isPublic: true,
        createdBy: users[0].id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1週間後
        options: {
          create: [
            {
              text: 'TypeScript',
              description: '型安全なJavaScript',
            },
            {
              text: 'Python',
              description: 'データサイエンスに強い',
            },
            {
              text: 'Go',
              description: 'Googleが開発した高速言語',
            },
            {
              text: 'Rust',
              description: 'メモリ安全性に優れた言語',
            },
          ],
        },
      },
      include: {
        options: true,
      },
    }),

    // 2. 昼食の投票
    prisma.poll.create({
      data: {
        title: '今日の昼食は何にしますか？',
        description: 'チームの昼食を決めましょう',
        category: 'food',
        status: 'active',
        allowMultiple: true,
        allowAddOptions: true,
        isPublic: true,
        createdBy: users[1].id,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2時間後
        options: {
          create: [
            {
              text: '寿司',
              description: '回転寿司チェーン',
            },
            {
              text: 'ラーメン',
              description: '近くの人気ラーメン店',
            },
            {
              text: 'カレー',
              description: 'インドカレー専門店',
            },
            {
              text: 'パスタ',
              description: 'イタリアンレストラン',
            },
          ],
        },
      },
      include: {
        options: true,
      },
    }),

    // 3. イベント日程の投票
    prisma.poll.create({
      data: {
        title: '次回のチームビルディングの日程',
        description: '全員が参加できる日程を決めましょう',
        category: 'event',
        status: 'active',
        allowMultiple: true,
        allowAddOptions: false,
        isPublic: true,
        createdBy: users[2].id,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5日後
        options: {
          create: [
            {
              text: '来週金曜日',
              description: '午後6時から',
            },
            {
              text: '来週土曜日',
              description: '午後2時から',
            },
            {
              text: '再来週金曜日',
              description: '午後6時から',
            },
            {
              text: '再来週土曜日',
              description: '午後2時から',
            },
          ],
        },
      },
      include: {
        options: true,
      },
    }),

    // 4. 終了済みの投票
    prisma.poll.create({
      data: {
        title: 'リモートワークの頻度について',
        description: '週にどのくらいリモートワークを希望しますか？',
        category: 'work',
        status: 'closed',
        allowMultiple: false,
        allowAddOptions: false,
        isPublic: true,
        createdBy: users[0].id,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1日前（期限切れ）
        options: {
          create: [
            {
              text: '週1日',
              description: '月曜日のみ',
            },
            {
              text: '週2-3日',
              description: 'バランス重視',
            },
            {
              text: '週4-5日',
              description: 'ほぼリモート',
            },
            {
              text: 'フルリモート',
              description: '完全在宅勤務',
            },
          ],
        },
      },
      include: {
        options: true,
      },
    }),
  ]);

  console.log('✅ Created polls:', polls.length);

  // サンプル投票データの作成
  const votes = await Promise.all([
    // 1つ目の投票への投票
    prisma.vote.create({
      data: {
        userId: users[1].id,
        pollId: polls[0].id,
        optionId: polls[0].options[0].id, // TypeScript
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[2].id,
        pollId: polls[0].id,
        optionId: polls[0].options[1].id, // Python
      },
    }),

    // 2つ目の投票への投票（複数選択）
    prisma.vote.create({
      data: {
        userId: users[0].id,
        pollId: polls[1].id,
        optionId: polls[1].options[0].id, // 寿司
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[0].id,
        pollId: polls[1].id,
        optionId: polls[1].options[2].id, // カレー
      },
    }),

    // 終了済み投票への投票
    prisma.vote.create({
      data: {
        userId: users[0].id,
        pollId: polls[3].id,
        optionId: polls[3].options[1].id, // 週2-3日
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[1].id,
        pollId: polls[3].id,
        optionId: polls[3].options[2].id, // 週4-5日
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[2].id,
        pollId: polls[3].id,
        optionId: polls[3].options[1].id, // 週2-3日
      },
    }),
  ]);

  console.log('✅ Created votes:', votes.length);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
