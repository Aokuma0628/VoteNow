# VoteNow - Claude Development Guide

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

### Issue完了時の使用量確認

**重要**: Issue の実装が完了した際は、必ず以下のコマンドを実行してClaude Codeの使用量を確認すること：

```bash
npx ccusage@latest
```

これにより、以下の情報を把握できます：

- トークン使用量の確認
- コスト状況の把握
- Cache使用効率の確認
- プロジェクト進行に伴うリソース消費の追跡

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

## Git規則

### コミットメッセージ

フォーマット: `<type> #<issue-number>: <description>`

**Type**: feat, fix, docs, style, refactor, test, chore

**例**:
- `feat #7: 投票詳細画面のUIコンポーネント追加`
- `fix #12: ヘッダーのレスポンシブ表示修正`

### ブランチ名

フォーマット: `<type>/#<issue-number>_<description>`

**例**: `feature/#7_vote_detail`

### 重要なコミット原則

**Claudeは作業進行に応じて適切な粒度でコミットを行う**：

- ファイル作成時: 独立したコミット
- 機能実装時: 動作する最小単位でコミット
- バグ修正時: 1つの問題につき1コミット

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
