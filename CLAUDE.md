# VoteNow - Claude Development Guide

## プロジェクト概要

VoteNowは、Next.js 15とTypescriptで構築されたモダンな投票アプリケーションです。このファイルはClaude AIがこのプロジェクトで開発作業を行う際のガイドラインを提供します。

## 技術スタック

- **フレームワーク**: Next.js 15.3.2 (App Router)
- **言語**: TypeScript 5.x
- **スタイリング**: Tailwind CSS 4.x
- **UIライブラリ**: shadcn/ui + Radix UI
- **アイコン**: Lucide React
- **リンティング**: ESLint + Prettier

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

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # ホームページ
├── components/         # Reactコンポーネント
│   ├── layout/        # レイアウト関連コンポーネント
│   └── ui/            # shadcn/ui UIコンポーネント
└── lib/               # ユーティリティ関数
    └── utils.ts       # 共通ユーティリティ
```

## 開発ガイドライン

### コンポーネント作成

1. **shadcn/ui**を活用：既存のUIコンポーネント（`src/components/ui/`）を最大限活用
2. **TypeScript**：すべてのコンポーネントで適切な型定義を使用
3. **ファイル命名**：kebab-caseを使用（例：`user-profile.tsx`）

### スタイリング

- **Tailwind CSS**をメインに使用
- **CSS Modules**や**styled-components**は避ける
- **Responsive design**を意識したクラス設計

### Next.js App Router

- **Server Components**をデフォルトで使用
- **Client Components**は必要な場合のみ`"use client"`で明示
- **Metadata API**を活用してSEOを最適化

## コミット前チェックリスト

- [ ] `npm run lint` - エラーなし
- [ ] `npm run format` - コード整形完了
- [ ] `npm run build` - ビルド成功
- [ ] TypeScriptエラーなし
- [ ] コンポーネントが適切に動作

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

## パフォーマンス考慮事項

- **Image Optimization**: Next.js の `Image` コンポーネントを使用
- **Code Splitting**: 動的インポートで必要に応じてコード分割
- **Bundle Analysis**: `npm run build`後にバンドルサイズを確認

## セキュリティ

- **環境変数**: `.env.local`でシークレット管理
- **API Routes**: 適切な認証・認可を実装
- **XSS対策**: React標準のエスケープ機能を活用

---

このガイドに従って、一貫性のある高品質なコードを維持してください。質問や提案があれば、GitHubのissueで共有してください。