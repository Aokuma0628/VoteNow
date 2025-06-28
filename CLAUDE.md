# VoteNow - Claude AI 開発ガイド

## 🔴 絶対遵守事項

### 1. 日本語での応答
**必須**: 全ての応答は日本語で行うこと

### 2. コミット・プッシュルール
**必須**: 以下のタイミングで必ずコミット・プッシュを実行すること
- ファイル作成・削除時
- 機能実装の最小動作単位完了時
- バグ修正完了時（1つの問題につき1コミット）
- リファクタリング完了時

**コミットメッセージ形式**:
```
<type> #<issue-number>: <description>
```
- **必ず1行で記載**
- type: feat, fix, docs, style, refactor, test, chore

**コミット後は即座にプッシュ**:
```bash
git add <files> && git commit -m "<message>" && git push
```

### 3. 作業完了通知
**必須**: タスク完了時は音声通知を実行
```bash
powershell.exe -Command '[System.Media.SystemSounds]::Hand.Play()'
```

### 4. 作業日誌
**必須**: Issue作業開始時に`./reports/issue-<number>.md`を作成
```bash
date '+%Y-%m-%d %H:%M'  # 日時取得用
```

### 5. 品質チェック
**必須**: コミット前に実行
```bash
npm run ci:check
```

---

## プロジェクト情報

### 技術スタック
- Next.js 15.3.2 (App Router)
- TypeScript 5.x
- Tailwind CSS 4.x
- shadcn/ui + Radix UI

### コーディング規約
- TypeScript: any型禁止、適切な型定義を使用
- 未使用変数: 削除または`_`プレフィックス
- スタイル: `cn()`でTailwindクラス結合
- 命名: ファイル(kebab-case)、コンポーネント(PascalCase)、変数(camelCase)

### Issue開始手順
```bash
git checkout main && git pull origin main
git checkout -b feature/#<issue-number>_<description>
git push -u origin feature/#<issue-number>_<description>
```

### エラー修正コマンド
```bash
npm run lint -- --fix    # ESLint自動修正
npm run format           # Prettier自動フォーマット
```

---

**重要**: このガイドの全てのルールは絶対遵守。特に「絶対遵守事項」セクションは例外なく守ること。