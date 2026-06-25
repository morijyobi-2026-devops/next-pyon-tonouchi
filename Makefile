# Convenience tasks (use `make <target>`)

.PHONY: help build dev docker:dev docker:dev:build docker:down docker:prod docker:prod:build lint start

help:
	@echo "Tasks"
	@echo "  build               — プロジェクトをビルドします"
	@echo "  dev                 — 開発サーバーを起動します (API: localhost:3000)"
	@echo "  docker:dev          — Docker で開発サーバーを起動します (Next: http://localhost:3000)"
	@echo "  docker:dev:build    — Docker イメージをビルドして開発サーバーを起動します"
	@echo "  docker:down         — Docker コンテナを停止・削除します"
	@echo "  docker:prod         — Docker で本番サーバーを起動します (http://localhost:3000)"
	@echo "  docker:prod:build   — Docker イメージをビルドして本番サーバーを起動します"
	@echo "  lint                — ESLint でチェックします"
	@echo "  start               — ビルド済みの成果物を起動します"

# Build Next.js app (if present)
build:
	npm run build:next

# Run API dev (nodemon). For full dev with Next run `make dev` in one terminal and `npm run dev:next` in another, or use docker:dev.
dev:
	npm run dev

# Docker (development)
docker:dev:
	docker-compose -f docker-compose.dev.yml up -d

docker:dev:build:
	docker-compose -f docker-compose.dev.yml up --build

docker:down:
	docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans

# Docker (production)
docker:prod:
	docker-compose up -d

docker:prod:build:
	docker-compose up --build

lint:
	npm run lint

start:
	npm run start:next
