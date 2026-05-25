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

- ドキュメントの品質向上のため、`markdownlint-cli2` を導入し、`husky` の pre-commit フックで `npm run
lint:md` を実行するよう設定しました。

- これら変更をコミットしました（Co-authored-by: Copilot）。

次の作業:

1. フロントエンドの最低限 UI を実装（ホーム画面で次の教室を表示）
2. テスト（TDD）を追加してコア API を保護
3. PR を作成してレビュー・マージ

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>

## リポジトリハーネス進捗（自動更新）

- 日付: 2026-05-18

- 状態: リポジトリレベルのハーネス実装を進行中

- 実施したこと:

  - husky の pre-commit を追加し、lint-staged を呼び出すように設定

  - lint-staged、Prettier、ESLint の設定を追加（package.json）

  - Pull Request で markdownlint を実行する GitHub Actions ワークフローを追加

  - 仕様書を作成: docs/superpowers/specs/2026-05-18-repo-harness-design.md

- 次にやること:

  - ローカルの開発依存インストールの残課題を解決（npm install が成功していれば完了）

  - pre-commit の動作をローカルで検証: ステージされたファイルがコミット前に整形・lint されることを確認

  - コードが増えたら CI に JS/TS の lint ステップを追加

## 2026-05-25（作業ログ）

本日行った作業の概要（詳細）:

- .editorconfig を追加（.editorconfig）: プロジェクト全体でインデントや改行、末尾スペースの扱いを統一
- markdownlint-cli2 を devDependency に追加（package.json）と lint:md スクリプト更新
  - インストール: npm install --save-dev markdownlint-cli2@latest
- package-lock.json を再生成して npm ci の不整合を解消（npm install を実行）
- docs/spec-v0.1.md、docs/plan-v0.1.md を作成し、markdownlint の指摘（改行・リスト周り、行長）に対応
- husky + lint-staged による pre-commit を利用
  - ステージされたファイルのみを prettier と markdownlint-cli2 で整形・検査
  - 注意: 現在 husky の警告が出る（pre-commit の古いヘッダー行） — 将来的に修正予定
- GitHub Actions に lint ワークフロー追加（.github/workflows/lint.yml）および CI ワークフロー修正（.github/workflows/ci.yml）
  - Node.js を 20 に更新（markdownlint-cli2 の依存 string-width が新しい正規表現 /v フラグを使用するため）
- ローカルと CI で lint を実行し、エラーを解消（最新の Lint ジョブは成功）
- 変更ファイル一覧:
  - .editorconfig
  - package.json
  - package-lock.json
  - .github/workflows/lint.yml
  - .github/workflows/ci.yml
  - docs/spec-v0.1.md
  - docs/plan-v0.1.md
  - README.md
- ブランチと PR:
  - ブランチ: chore/editorconfig-markdownlint
  - PR: [#4](https://github.com/morijyobi-2026-devops/next-pyon-tonouchi/pull/4)

確認方法（手順）:

1. ローカルで依存を更新: npm install
2. ローカルで検証: npm ci && npm run lint && npm run lint:md
3. PR を確認: Actions の Lint ジョブが成功していることを確認

備考:

- Markdown ファイルのみ trim_trailing_whitespace を false に設定して、意図的な末尾スペース（行末の 2 スペース）を許容しています

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
