# Next.js Application

## 概要

Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui で構築されたモダンなWebアプリケーション。

## 技術スタック

- **Next.js**: 15.3.2 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x (with @tailwindcss/postcss)
- **shadcn/ui**: UIコンポーネントライブラリ
- **Lucide React**: アイコンライブラリ
- **Prisma**: ORMとデータベースクライアント
- **Neon**: PostgreSQLデータベース

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成し、必要な環境変数を設定してください。

```bash
cp .env.example .env.local
```

`.env.local`を編集して以下を設定：

- `DATABASE_URL`: NeonのPostgreSQLデータベース接続URL

### 3. データベースのセットアップ

```bash
# Prismaクライアントを生成
npm run db:generate

# データベーススキーマを同期
npm run db:push

# 開発用サンプルデータを投入（オプション）
npm run db:seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリケーションを確認できます。

## 開発コマンド

### アプリケーション

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルド
- `npm run start` - 本番サーバーを起動

### コード品質

- `npm run lint` - ESLintでコードチェック
- `npm run format` - Prettierでコード整形
- `npm run ci:check` - リント・フォーマット・ビルドを一括実行

### データベース

- `npm run db:generate` - Prismaクライアントを生成
- `npm run db:push` - スキーマをデータベースに同期
- `npm run db:migrate` - マイグレーションを実行
- `npm run db:seed` - シードデータを投入
- `npm run db:studio` - Prisma Studioを起動（データベースGUI）

## データベース構成

### テーブル構成

- **users**: ユーザー情報
- **polls**: 投票（アンケート）
- **poll_options**: 投票の選択肢
- **votes**: 投票履歴

### シードデータ

開発用のサンプルデータが含まれています：

- 3人のサンプルユーザー
- 4つのサンプル投票（プログラミング言語、昼食、イベント日程、リモートワーク）
- 各投票に対するサンプル投票データ
