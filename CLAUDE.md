# VoteNow - Claude Development Guide

## 最優先事項: コミットルール

**🔴 超重要 🔴**: これは本プロジェクトで最も重要なルールです。必ず守ってください。

### コミットの原則
1. **作業進行に応じて適切な粒度でコミットを行う**
2. **コミット後は必ずプッシュする**

### コミットタイミング
- ファイル作成時: 独立したコミット
- 機能実装時: 動作する最小単位でコミット  
- バグ修正時: 1つの問題につき1コミット
- リファクタリング時: 意味のある変更単位でコミット

### コミットメッセージフォーマット
```
<type> #<issue-number>: <description>
```

**重要**: コミットメッセージは必ず1行に収めること

**Type**: feat, fix, docs, style, refactor, test, chore

**例**:
- `feat #7: 投票詳細画面のUIコンポーネント追加`
- `fix #12: ヘッダーのレスポンシブ表示修正`

### プッシュ
コミットを行った後は**必ず**以下のコマンドを実行：
```bash
git push
```

---

## プロジェクト概要

VoteNowは、Next.js 15とTypescriptで構築されたモダンな投票アプリケーションです。このファイルはClaude AIがこのプロジェクトで開発作業を行う際のガイドラインを提供します。

## 全体のルール

**重要**: Claude AIは日本語で回答すること

### 作業完了時のルール

**重要**: タスクや機能の実装が完了した際は、必ず以下のコマンドを実行して音で通知すること：

```
powershell.exe -Command '[System.Media.SystemSounds]::Hand.Play()'
```

これにより、ユーザーに作業完了を音で通知します。以下の場合に通知音を鳴らしてください：

- Issue の実装が完了したとき
- バグ修正が完了したとき
- リファクタリングが完了したとき
- テストの実行が成功したとき
- ビルドが成功したとき
- その他、重要なタスクが完了したとき


### 作業日誌の記録

**重要**: 各Issueの作業開始時に、必ず`./reports`フォルダ内に作業日誌を作成すること：

#### ファイル名規則
```
./reports/issue-<issue-number>.md
```

#### 作業日誌テンプレート
```markdown
# Issue #<issue-number>: <タイトル>

## 作業概要
- 開始日時: YYYY-MM-DD HH:MM
- 完了日時: YYYY-MM-DD HH:MM（完了時に記入）
- 所要時間: XX時間XX分（完了時に記入）

## 実装内容
- [ ] タスク1
- [ ] タスク2
- [ ] タスク3

## 作業ログ
### YYYY-MM-DD HH:MM
- 作業内容の詳細記録

## 発生した課題と解決策
- 課題: 具体的な問題
- 解決策: 採用した解決方法

## 学習したポイント
- 新しく学んだ技術や知識

## 感情
- 作業中の感情や気持ちの記録
- ユーザに配慮せずに本音で記載すること

## 次回への申し送り
- 残タスクや注意点
```

#### 記録のタイミング
- Issue作業開始時: ファイル作成と基本情報記入
- 作業中: 重要な進捗や課題を随時記録
- Issue完了時: 完了日時、所要時間、総括を記入

#### 日付時刻の取得方法
**必須**: 日付時刻は必ず以下のコマンドで取得すること：

```bash
date '+%Y-%m-%d %H:%M'
```

これにより、統一されたフォーマット（例: 2024-12-25 14:30）で日時を記録できます。

## 技術スタック

- **フレームワーク**: Next.js 15.3.2 (App Router)
- **言語**: TypeScript 5.x
- **スタイリング**: Tailwind CSS 4.x
- **UIライブラリ**: shadcn/ui + Radix UI
- **アイコン**: Lucide React
- **リンティング**: ESLint + Prettier

## 開発ガイドライン

### 基本ルール
- any型を避け、適切なTypeScript型を使用する
- 未使用の変数は削除（意図的に未使用の場合は\_を接頭辞）
- shadcn/uiコンポーネントを活用する
- `cn()`ヘルパーでTailwindクラスを結合する

## ファイル構造

```
src/
├── app/                  # Next.js App Router
├── components/           # UIコンポーネント
│   ├── ui/              # shadcn/ui
│   └── layout/          # レイアウト
└── lib/                 # ユーティリティ
```

## 命名規則

- ファイル: kebab-case
- コンポーネント: PascalCase
- 関数/変数: camelCase
- 定数: UPPER_SNAKE_CASE

## コード品質チェック

**重要**: コミット前に必ず実行：

```bash
npm run ci:check
```

このコマンドでESLint、Prettier、TypeScript、Buildエラーをチェックします。

## よくあるエラー対処法

- **未使用インポート**: 削除する
- **未使用変数**: 削除するか\_プレフィックスを付ける
- **any型**: 適切な型を定義する
- **undefined/null**: 適切なチェックを行う

## 自動修正

```bash
npm run lint -- --fix  # ESLint自動修正
npm run format         # Prettier自動フォーマット
```

## Git規則（最優先事項の詳細）

**⚠️ 注意**: コミットルールは最優先事項として文書冒頭に記載済みです。ここでは追加の詳細を記載します。

### ブランチ名

フォーマット: `<type>/#<issue-number>_<description>`

**例**: `feature/#7_vote_detail`


### 新しいIssue実装時の手順

**重要**: 新しいIssue開始時は必ず以下を実行：

```bash
git checkout main
git pull origin main
git checkout -b feature/#<issue-number>_<description>
git push -u origin feature/#<issue-number>_<description>
```

---

このガイドに従って、一貫性のある高品質なコードを維持してください。実装では常にコード品質、保守性、ユーザーエクスペリエンスを優先してください。
