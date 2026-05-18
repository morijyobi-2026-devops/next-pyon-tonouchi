# next-pyon-tonouchi

Linux 開発環境の動作確認

以下の手順で、Linux 上の開発環境が正しく動作するか確認してください。

1. リポジトリのルートに移動

   cd next-pyon-tonouchi

2. 基本ツールのバージョン確認

   git --version
   node --version
   npm --version

3. （任意）依存関係のインストール（package.json が存在する場合）

   npm install

4. （任意）開発サーバ起動（スクリプトがある場合）

   npm run dev

問題が発生した場合は、実行結果をここに貼ってください。

---

## 2026-05-14（作業ログ）

本日行った作業の概要:

- copilot セッションを復元し、superpowers プラグインを導入しました。
- 新しい開発ブランチ `dev/implement-backend` を作成しました。
- バックエンドの基本実装を追加しました: `src/index.js`, `src/db.js`, `src/init_db.js`。
  - SQLite のマイグレーションを実行し、サーバを起動して `/api/health` の応答を確認しました。
- ドキュメントの品質向上のため、`markdownlint-cli2` を導入し、`husky` の pre-commit フックで `npm run lint:md` を実行するよう設定しました。
- これら変更をコミットしました（Co-authored-by: Copilot）。

次の作業:

1. フロントエンドの最低限 UI を実装（ホーム画面で次の教室を表示）
2. テスト（TDD）を追加してコア API を保護
3. PR を作成してレビュー・マージ

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
