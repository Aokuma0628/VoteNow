# VoteNow - Claude Development Guide

## プロジェクト概要

VoteNowは、Next.js 15とTypescriptで構築されたモダンな投票アプリケーションです。このファイルはClaude AIがこのプロジェクトで開発作業を行う際のガイドラインを提供します。

## 全体のルール

**重要**: Claude AIは日本語で回答すること

## プロジェクトコンテキスト

- Next.js 15+ with App Router
- TypeScript strict mode
- Tailwind CSS（スタイリング用）
- shadcn/ui（UIコンポーネント用）
- Lucide React（アイコン用）

## 技術スタック

- **フレームワーク**: Next.js 15.3.2 (App Router)
- **言語**: TypeScript 5.x
- **スタイリング**: Tailwind CSS 4.x
- **UIライブラリ**: shadcn/ui + Radix UI
- **アイコン**: Lucide React
- **リンティング**: ESLint + Prettier

## コードスタイル & フォーマット

### Prettier設定（これらのルールで自動フォーマット）

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "bracketSameLine": false
}
```

### 従うべきESLintルール

- コード提出前に常にESLintエラーを修正する
- 可能な限りletよりもconstを選択する
- 未使用の変数を削除する（意図的に未使用の場合は\_を接頭辞にする）
- 意味のある変数名と関数名を使用する
- any型を避け、適切なTypeScript型を使用する
- JSXファイルでReactをインポートしない（Next.jsが処理する）

## TypeScriptガイドライン

### 型定義

- 共有される場合は別ファイルでinterface/type定義を作成する
- 厳密な型付けを使用し、anyを避ける
- 適切な場合はenumよりもtype unionsを選択する
- 読み取り専用データにはconst assertionsを使用する
- 必要に応じてtypes/ディレクトリから型をエクスポートする

### 関数シグネチャ

- 複雑な関数には明示的な戻り値の型を使用する
- シンプルなコールバックにはアロー関数を選択する
- メインコンポーネント関数には関数宣言を使用する

### 例:

```typescript
// 良い例
interface UserProps {
  id: string;
  name: string;
  email: string;
}

const UserCard = ({ id, name, email }: UserProps): JSX.Element => {
  return <div>...</div>;
};

// 悪い例
const UserCard = (props: any) => {
  return <div>...</div>;
};
```

## React/Next.jsベストプラクティス

### コンポーネント構造

- フックを使用した関数コンポーネントを使用する
- コンポーネントを小さく集中的に保つ（単一責任）
- 再利用可能なロジックのためのカスタムフックを抽出する
- 重いコンポーネントにはReact.memo()を使用する

### Next.js App Router

- 適切なファイルベースルーティング規則を使用する
- loading.tsxとerror.tsxページを実装する
- デフォルトでサーバーコンポーネント、必要時にクライアントコンポーネントを使用
- 画像にはNext.js Imageコンポーネントを活用する

### 状態管理

- ローカル状態にはuseStateを使用する
- フォーム状態には適切な状態管理を実装する
- 真にグローバルな状態にのみReactコンテキストを慎重に使用する

## shadcn/ui & スタイリング

### shadcn/uiコンポーネント

- `npx shadcn@latest add [component]`でコンポーネントを追加
- `src/components/ui/`ディレクトリにコンポーネントを配置
- `tailwind-merge`と`class-variance-authority`を活用
- `lucide-react`アイコンを使用

### Tailwind CSS

- ユーティリティクラスを優先して使用
- カスタムコンポーネントでは`cn()`ヘルパーを使用
- レスポンシブデザインを考慮

### コンポーネント例:

```typescript
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function Component({ className, children }: ComponentProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>タイトル</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
```

## ファイル組織

### ディレクトリ構造

```
src/
├── app/                  # Next.js App Routerページ
├── components/           # 再利用可能なUIコンポーネント
│   ├── ui/              # shadcn/uiコンポーネント
│   └── layout/          # レイアウトコンポーネント
└── lib/                 # ユーティリティ関数
```

### 命名規則

- ファイル: kebab-case (user-profile.tsx)
- コンポーネント: PascalCase (UserProfile)
- 関数/変数: camelCase (getCurrentUser)
- 定数: UPPER_SNAKE_CASE (API_BASE_URL)
- 型/インターフェース: PascalCase (UserProfile, ApiResponse)

## インポート組織

```typescript
// 1. 外部ライブラリ
import React from 'react';
import { NextRequest } from 'next/server';

// 2. 内部モジュール（絶対インポート推奨）
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 3. 相対インポート
import './component.css';
```

## 開発環境セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 型チェック（必要に応じて）
npx tsc --noEmit
```

## コード品質とフォーマット

**重要**: コードを変更した後は必ず以下のコマンドを実行してください：

```bash
# リンティングチェック
npm run lint

# コードフォーマット
npm run format

# CI用の総合チェック
npm run ci:check
```

## CI/CDチェック

### コミット前の必須チェック

すべてのコードをコミットする前に、以下のコマンドを実行してエラーがないことを確認する：

```bash
npm run ci:check
```

このコマンドは以下を実行します：

1. **ESLint**: コード品質とスタイルのチェック
2. **Prettier**: コードフォーマットの自動修正
3. **TypeScript**: 型チェック
4. **Next.js Build**: ビルドエラーのチェック

### よくあるエラーと対処法

#### 1. 未使用のインポート

```typescript
// ❌ 悪い例
import { Users, Calendar, Clock } from 'lucide-react'; // UsersとCalendarが未使用

// ✅ 良い例
import { Click } from 'lucide-react';
```

#### 2. 未使用のパラメータ/変数

```typescript
// ❌ 悪い例
interface Props {
  title: string;
  showSidebar?: boolean; // 使用されていない
}

export function Component({ title, showSidebar }: Props) {
  return <div>{title}</div>;
}

// ✅ 良い例 - オプション1: 削除する
interface Props {
  title: string;
}

export function Component({ title }: Props) {
  return <div>{title}</div>;
}

// ✅ 良い例 - オプション2: アンダースコアプレフィックス
export function Component({ title, _showSidebar }: Props) {
  return <div>{title}</div>;
}
```

#### 3. any型の使用

```typescript
// ❌ 悪い例
const handleChange = (event: any) => {
  console.log(event.target.value);
};

// ✅ 良い例
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};

// Chart.jsなど外部ライブラリの型が不明な場合
const tooltipCallback = (context: { label: string; raw: unknown }) => {
  // unknown型を使用し、必要に応じて型アサーション
  const value = context.raw as number;
  return `${context.label}: ${value}`;
};
```

#### 4. undefined/nullチェック

```typescript
// ❌ 悪い例
const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

// vote.expiresAtがDate | undefinedの場合
formatDate(vote.expiresAt); // エラー: undefinedの可能性

// ✅ 良い例
if (vote.expiresAt) {
  formatDate(vote.expiresAt);
}

// または三項演算子を使用
const dateText = vote.expiresAt ? formatDate(vote.expiresAt) : '未設定';
```

#### 5. コンポーネントのプロップス型定義

```typescript
// ❌ 悪い例
export function VoteResults({ options, totalVotes, allowMultiple }) {
  // 型が推論されない
}

// ✅ 良い例
interface VoteResultsProps {
  options: VoteOption[];
  totalVotes: number;
  _allowMultiple?: boolean; // 未使用の場合は_プレフィックス
}

export function VoteResults({ options, totalVotes, _allowMultiple }: VoteResultsProps) {
  // 型安全なコード
}
```

### デバッグのヒント

1. **ESLintエラーの詳細確認**:

   ```bash
   npm run lint -- --format=verbose
   ```

2. **TypeScriptエラーの詳細確認**:

   ```bash
   npx tsc --noEmit --pretty
   ```

3. **特定ファイルのみチェック**:
   ```bash
   npx eslint src/app/vote/[id]/page.tsx
   ```

### 自動修正

一部のエラーは自動修正可能：

```bash
# ESLintの自動修正
npm run lint -- --fix

# Prettierの自動フォーマット
npm run format
```

## エラーハンドリング

### クライアントサイド

- コンポーネントレベルのエラーにはエラーバウンダリを使用する
- 適切なローディングとエラー状態を実装する
- ユーザーフレンドリーなエラーメッセージを表示する

### サーバーサイド

- 十分なコンテキストでエラーをログに記録する
- 適切なHTTPステータスコードを返す
- エラーメッセージで機密情報を公開しない

## パフォーマンス最適化

- React.memo()を適切に使用する
- 適切なローディング状態を実装する
- Next.js Imageコンポーネントを使用する
- 適切な場合にコンポーネントを遅延読み込みする
- 動的インポートでバンドルサイズを最適化する

## コードレビューチェックリスト

- [ ] コードがフォーマットルールに従っている（Prettier）
- [ ] ESLintエラーや警告がない
- [ ] 適切なTypeScript型付け
- [ ] エラーハンドリングが実装されている
- [ ] パフォーマンスが考慮されている
- [ ] 必要に応じてドキュメントが更新されている

## トラブルシューティング

### よくある問題

1. **型エラー**: `npx tsc --noEmit`で詳細確認
2. **リンティングエラー**: `npm run lint:fix`で自動修正
3. **ビルドエラー**: `npm run build`でエラー詳細確認

### 依存関係の問題

```bash
# node_modulesとlock fileをクリーン
rm -rf node_modules package-lock.json
npm install
```

## セキュリティ

- **環境変数**: `.env.local`でシークレット管理
- **API Routes**: 適切な認証・認可を実装
- **XSS対策**: React標準のエスケープ機能を活用

## Gitルール

### コミットメッセージルール

#### フォーマット

```
<type> #<issue-number>: <description>
```

#### Type（種別）

- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響を与えない変更（空白、フォーマット、セミコロンの欠落など）
- `refactor`: バグ修正でも機能追加でもないコード変更
- `perf`: パフォーマンスを向上させるコード変更
- `test`: 不足しているテストの追加や既存のテストの修正
- `chore`: ビルドプロセスやドキュメント生成などの補助ツールやライブラリの変更
- `build`: ビルドシステムや外部依存関係に影響する変更
- `ci`: CI設定ファイルとスクリプトの変更
- `revert`: 以前のコミットを取り消す

#### ルール

1. **Issue番号を必ず含める**: `#7` のような形式で関連するIssue番号を記載
2. **日本語で記載**: 説明は日本語で簡潔に記載する
3. **現在形を使用**: 「〜を追加」「〜を修正」のように現在形で記載
4. **50文字以内**: タイトルは50文字以内に収める
5. **具体的に記載**: 何を変更したのか明確に記載する
6. **1行で記載**: コミットメッセージは１行に収める

#### 良い例

- `feat #7: 投票詳細画面のUIコンポーネントを追加`
- `fix #12: ヘッダーのレスポンシブ表示を修正`
- `style #7: CSSスタイルの更新`
- `docs #3: READMEにインストール手順を追加`
- `refactor #15: 投票ロジックをカスタムフックに分離`
- `test #8: VoteCardコンポーネントのユニットテストを追加`
- `chore #20: ESLintの設定を更新`

#### 悪い例

- `更新` （typeとissue番号がない、内容が不明確）
- `feat: 機能追加` （issue番号がない、内容が不明確）
- `fix #7: バグ修正` （何のバグか不明）
- `style #7: コードを綺麗にした` （具体的でない）

### ブランチ名ルール

#### フォーマット

```
<type>/#<issue-number>_<description>
```

#### 例

- `feature/#7_vote_detail`
- `fix/#12_header_responsive`
- `docs/#3_readme_update`
- `refactor/#15_vote_logic_hook`
- `test/#8_vote_card_unit_test`

#### ルール

1. **Issue番号を含める**: ブランチがどのIssueに関連するかを明確にする
2. **アンダースコア区切り**: 単語間はアンダースコアで区切る
3. **簡潔な説明**: ブランチの目的が分かる簡潔な説明を含める
4. **小文字のみ**: 英数字とアンダースコア、ハイフンのみ使用

### コミットのベストプラクティス

#### コミット頻度

- **小さな単位でコミット**: 1つの機能や修正につき1コミット
- **作業中も定期的にコミット**: 作業の途中でもWIPコミットを作成
- **意味のある単位でコミット**: 関連する変更をまとめてコミット

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
# 新しいfeatureブランチを作成
git checkout -b feature/#7_vote_detail

# リモートブランチを追跡
git push -u origin feature/#7_vote_detail
```

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
