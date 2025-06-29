# VoteNow - Claude Development Guide

## 🔴 必須ルール（絶対厳守）🔴

これらのルールは**例外なく必ず守る**こと。守らない場合は作業を中止すること。

### 1. コミット＆プッシュルール

**最重要**: 作業の進行に応じて適切にコミット＆プッシュを行う

#### コミットタイミング（必須）
- 機能実装時: 動作する最小単位でコミット
- バグ修正時: 1つの問題につき1コミット
- リファクタリング時: 意味のある変更単位でコミット

#### コミットメッセージフォーマット（厳守）
```
<type> #<issue-number>: <description>
```
- **必ず1行で記載**
- **必ずIssue番号を含める**
- **日本語で記載**
- **Type**: feat, fix, docs, style, refactor, test, chore
- **Claude Code生成テンプレートは不要**（🤖 Generated with... Co-Authored-By... 等は追加しない）

#### プッシュ（必須）
```bash
# コミット後は必ず実行
git push
```

### 2. 作業日誌記録ルール

**必須**: 各Issue作業開始時に`./reports/issue-<issue-number>.md`を作成

#### 日時取得コマンド（必須使用）
```bash
date '+%Y-%m-%d %H:%M'
```

#### 記録のタイミング
- Issue作業開始時: ファイル作成と基本情報記入
- 作業中: 重要な進捗や課題を随時記録
- Issue完了時: 完了日時、所要時間、総括を記入

### 3. 作業完了通知ルール

**必須**: タスク完了時は必ず音で通知
```bash
powershell.exe -Command '[System.Media.SystemSounds]::Hand.Play()'
```

通知するタイミング：
- Issueの実装が完了したとき
- バグ修正が完了したとき
- リファクタリングが完了したとき
- テストの実行が成功したとき
- ビルドが成功したとき
- その他、重要なタスクが完了したとき

### 4. コード品質チェックルール

**必須**: コミット前に必ず実行
```bash
npm run ci:check
```

エラーがある場合はコミット禁止。

### 5. 言語ルール

**必須**: 日本語で回答すること

---

## 🟡 重要ルール（原則厳守）🟡

これらのルールは特別な理由がない限り必ず守ること。

### ブランチ運用

#### 新しいIssue実装時の手順
```bash
# 新Issue開始時は必ず実行
git checkout main
git pull origin main
git checkout -b feature/#<issue-number>_<description>
git push -u origin feature/#<issue-number>_<description>
```

#### ブランチ名フォーマット
`<type>/#<issue-number>_<description>`

例: `feature/#7_vote_detail`

### TypeScriptルール
- any型の使用禁止
- 未使用変数は削除または`_`プレフィックス
- 適切な型定義の使用

### コンポーネント開発
- shadcn/uiコンポーネントの活用
- `cn()`ヘルパーでのクラス結合
- 小さく集中的なコンポーネント設計

---

## 🟢 推奨ルール（可能な限り遵守）🟢

### 開発ガイドライン
- shadcn/uiコンポーネントを活用する
- `cn()`ヘルパーでTailwindクラスを結合する

### 命名規則
- ファイル: kebab-case
- コンポーネント: PascalCase
- 関数/変数: camelCase
- 定数: UPPER_SNAKE_CASE

### よくあるエラー対処法
- **未使用インポート**: 削除する
- **未使用変数**: 削除するか`_`プレフィックスを付ける
- **any型**: 適切な型を定義する
- **undefined/null**: 適切なチェックを行う

### 自動修正
```bash
npm run lint -- --fix  # ESLint自動修正
npm run format         # Prettier自動フォーマット
```

---

## プロジェクト概要

VoteNowは、Next.js 15とTypescriptで構築されたモダンな投票アプリケーションです。このファイルはClaude AIがこのプロジェクトで開発作業を行う際のガイドラインを提供します。

## 技術スタック

- **フレームワーク**: Next.js 15.3.2 (App Router)
- **言語**: TypeScript 5.x
- **スタイリング**: Tailwind CSS 4.x
- **UIライブラリ**: shadcn/ui + Radix UI
- **アイコン**: Lucide React
- **リンティング**: ESLint + Prettier

## ファイル構造

```
src/
├── app/                  # Next.js App Router
├── components/           # UIコンポーネント
│   ├── ui/              # shadcn/ui
│   └── layout/          # レイアウト
└── lib/                 # ユーティリティ
```

---

## 作業日誌テンプレート

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

---

**重要**: このガイドの必須ルール（🔴）は例外なく厳守すること。ルールに迷った場合は、より厳格な解釈を採用すること。
