# Harness Engineering — Repo harness (v0.1)

Date: 2026-05-18

## 概要
本仕様は「リポジトリ優先」のハーネス実装（v0.1）を定義する。目的は「フォーマット・リンティングがパスしたコードだけがコミットされる」環境を作ること。開発者の手間を最小化しつつ品質保証を自動化する。

## スコープ
- 対象: このリポジトリ（next-pyon-tonouchi）のソースコードとドキュメント
- 含む: pre-commit フック（husky）＋ lint-staged 設定、ESLint/Prettier/markdownlint の導入、PR 用 CI（GitHub Actions）での検証、ブランチ保護の推奨設定
- 除外: デプロイや運用監視（将来的に拡張）

## 目標(success criteria)
1. コミット時にステージされたファイルのみが自動で整形・修正される
2. 整形・修正後に未解決の lint エラーがあればコミットをブロックする
3. Pull Request の CI で同一の linters/tests を実行し、マージ前のゲートとする

## コンポーネント
- .husky/pre-commit: npx --no-install lint-staged を呼ぶ
- package.json: lint-staged 設定、npm scripts (lint, format, lint:md)
- ESLint: src/**/*.js に対する静的解析、--fix をステージ時に試行
- Prettier: コード・JSON・Markdown の整形
- markdownlint-cli2: docs/とREADME.md の lint
- .github/workflows/ci.yml: npm ci; npm run lint; npm test を実行

## ワークフロー
- 開発者: ファイルを編集 -> git add <files> -> git commit
  - pre-commit が lint-staged を実行（ステージのみ対象）
  - 自動fix が入る場合は再ステージされる
  - unresolved errors があるとコミット失敗
- CI: PR で Actions がフル lint/test を実行、失敗するとマージ不可

## 導入手順（実装プランの要約）
1. package.json に lint-staged, prettier, eslint, markdownlint の設定追加
2. .eslintrc.json と .prettierrc を追加
3. .husky/pre-commit を lint-staged 呼び出しに更新
4. GitHub Actions ワークフローを追加（ci.yml）
5. ブランチ保護ルールの適用（PR 必須・CI 通過必須）

## 検証とローアウト
- ローカル: npm install -> git add + git commit でフック実行を確認
- CI: PR を作成して Actions が成功することを確認
- ドキュメント: README に開発者向け手順を追記

## 次のステップ
- この仕様をコミットする（DONE）
- writing-plans スキルで実行プラン（タスク分解）を作成する

---
Spec self-review checklist:
- [x] スコープが単一（リポジトリ優先）
- [x] 具体的なコンポーネント/ファイルを示した
- [x] 検証手順を明記

