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

### コミットのベストプラクティス

#### コミット頻度

- **小さな単位でコミット**: 1つの機能や修正につき1コミット
- **作業中も定期的にコミット**: 作業の途中でもWIPコミットを作成
- **意味のある単位でコミット**: 関連する変更をまとめてコミット

#### コミット粒度の原則

**重要**: Claudeは作業の進行に応じて適切な粒度でコミットを行うこと：

1. **論理的な単位でコミット**

   - ファイルの追加・作成: 独立したコミット
   - 機能の実装: 動作する最小単位でコミット
   - バグ修正: 1つの問題につき1コミット
   - リファクタリング: 変更の種類ごとにコミット

2. **コミットのタイミング**

   - 新しいファイルを作成したとき
   - 既存ファイルに機能を追加したとき
   - テストが通る状態になったとき
   - リファクタリングが完了したとき
   - 設定ファイルを更新したとき

3. **避けるべきコミットパターン**

   - ❌ 複数の機能を1つのコミットにまとめる
   - ❌ 未完成の機能をコミット（WIPを除く）
   - ❌ 無関係な変更を同じコミットに含める
   - ❌ 大量のファイル変更を1つのコミットにする

4. **推奨されるコミット例**

   ```bash
   # ファイル作成時
   git add src/components/VoteCard.tsx
   git commit -m "feat #7: VoteCardコンポーネントの新規作成"

   # 機能追加時
   git add src/components/VoteCard.tsx
   git commit -m "feat #7: VoteCardに投票機能を実装"

   # スタイル修正時
   git add src/components/VoteCard.tsx
   git commit -m "style #7: VoteCardのレスポンシブデザイン対応"

   # バグ修正時
   git add src/components/VoteCard.tsx
   git commit -m "fix #7: VoteCardの投票数計算ロジックを修正"
   ```

5. **作業フローの例**

   ```bash
   # 1. 新しいコンポーネントファイルを作成
   # → すぐにコミット

   # 2. 基本的な構造を実装
   # → コミット

   # 3. 主要な機能を追加
   # → コミット

   # 4. スタイリングを適用
   # → コミット

   # 5. エラーハンドリングを追加
   # → コミット
   ```

#### コミット前のチェック

```bash
# 必須チェック（コミット前に必ず実行）
npm run ci:check

# ステージング前の確認
git status
git diff

# 部分的なステージング（必要に応じて）
git add -p
```

#### WIPコミットの活用

```bash
# 作業中のコミット
git commit -m "WIP #7: 投票詳細画面の実装中"

# 後でまとめる場合は squash を使用
git rebase -i HEAD~3
```

### プルリクエスト（PR）ルール

#### PRタイトル

コミットメッセージと同じフォーマットを使用：

```
<type> #<issue-number>: <description>
```

#### PR説明テンプレート

```markdown
## 概要

このPRで何を実装/修正したかを簡潔に説明

## 変更内容

- [ ] 実装した機能1
- [ ] 修正したバグ1
- [ ] 追加したテスト1

## 確認事項

- [ ] ESLintエラーなし
- [ ] TypeScriptエラーなし
- [ ] ビルドエラーなし
- [ ] 動作確認済み

## 関連Issue

Closes #7

## スクリーンショット（必要に応じて）
```

#### PRのベストプラクティス

1. **小さなPRを心がける**: レビューしやすいサイズに保つ
2. **セルフレビューを実施**: 提出前に自分でコードを確認
3. **適切なレビュアーを指定**: 関連する機能に詳しい人をアサイン
4. **CI/CDチェックをパス**: 全てのチェックが通ることを確認

### Git操作のベストプラクティス

#### ブランチ作成とチェックアウト

```bash
# developブランチから新しいfeatureブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/#7_vote_detail

# リモートブランチを追跡
git push -u origin feature/#7_vote_detail
```

**重要**: 新しいブランチは必ず `develop` ブランチから作成すること

#### Issue実装時のブランチ切り替えルール

**重要**: Claudeは新しいIssueの実装を開始する際は、必ず以下の手順でブランチを切り替えること：

1. **developブランチへの切り替えと更新**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **新しいfeatureブランチの作成**
   ```bash
   git checkout -b feature/#<issue-number>_<description>
   ```

3. **リモートブランチの追跡設定**
   ```bash
   git push -u origin feature/#<issue-number>_<description>
   ```

この手順により、以下を確実にする：
- 最新のdevelopブランチから作業を開始
- Issue番号に基づいた適切なブランチ名
- リモートとの適切な追跡関係の設定

#### コミット履歴の整理

```bash
# 直前のコミットを修正
git commit --amend

# 複数のコミットをまとめる
git rebase -i HEAD~3

# 不要なコミットを削除
git reset --soft HEAD~1
```

#### コンフリクト解決

```bash
# マージコンフリクトの確認
git status

# コンフリクト解決後
git add .
git commit

# リベースコンフリクトの場合
git rebase --continue
```

#### リモートとの同期

```bash
# 最新の変更を取得
git fetch origin

# mainブランチと同期
git rebase origin/main

# 強制プッシュ（リベース後）
git push --force-with-lease
```

### 禁止事項

1. **mainブランチへの直接プッシュ**: 必ずPRを通すこと
2. **--force プッシュ**: `--force-with-lease` を使用すること
3. **大きすぎるファイルのコミット**: `.gitignore`を適切に設定
4. **機密情報のコミット**: API keyや秘密情報は絶対にコミットしない
5. **不完全なコードのマージ**: 必ずテストとレビューを通すこと

---

このガイドに従って、一貫性のある高品質なコードを維持してください。質問や提案があれば、GitHubのissueで共有してください。

実装では常にコード品質、保守性、ユーザーエクスペリエンスを優先してください。
