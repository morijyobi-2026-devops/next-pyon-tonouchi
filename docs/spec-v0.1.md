# Spec v0.1 — コード・エディタ設定と Markdown lint ワークフロー

目的

- チームでコード/Markdown のフォーマットを統一する
- コミット前に変更ファイルだけを自動で整形/lint する
- Pull Request で CI による検証を行う

要件

- EditorConfig を使って基本的なインデントや改行ルールを共有する
- Markdown lint は markdownlint-cli2 を使う
- Husky + lint-staged でコミット時にステージされたファイルだけを lint/format する
- GitHub Actions で PR に対して lint を実行する

受入基準

- リポジトリに .editorconfig がある
- コミット時にステージされた.md/.js が linted/formatted される
- PR 作成時に GitHub Actions が lint を実行する
