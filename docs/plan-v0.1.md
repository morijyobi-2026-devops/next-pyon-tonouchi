# Plan v0.1 — 実装手順

1. .editorconfig を追加（リポジトリルート）
2. markdownlint-cli2 を devDependency に追加。
   既存の markdownlint-cli 呼び出しを markdownlint-cli2 に置換
3. lint-staged と Husky（既に準備済み）でステージされたファイルのみを lint する設定を確認
4. GitHub Actions ワークフローを追加して、PR 時に npm ci && npm run lint && npm run lint:md を実行
5. 動作確認：ローカルでコミット（ステージ）→ pre-commit が lint-staged を実行、PR で Actions が通ることを確認

備考

- Markdown ファイルだけは trim_trailing_whitespace = false として、意図的な末尾スペース（行末の 2 スペース）を許容する
- 必要なら .markdownlint.json を追加してルール調整する
