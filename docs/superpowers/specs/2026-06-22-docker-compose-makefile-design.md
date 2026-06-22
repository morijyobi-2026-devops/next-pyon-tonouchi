# Project Spec: Docker Compose + Makefile for next-pyon-tonouchi

Date: 2026-06-22
Author: superpowers (assistant)

## Overview

This project contains a Next.js frontend (pages/) and an Express API (src/index.js) backed by SQLite. Goal: provide reproducible local and production runs using Docker (docker-compose) and simple developer task entrypoints via Makefile (task shim). CI builds images on push (build-only) via GitHub Actions.

## Architecture

- Services:
  - web: Next.js application (port 3000)
  - api: Express API (container port 3000, host mapped to 3001 in dev compose)
  - db: SQLite file stored on a Docker volume (/data/sqlite.db)
- Runtime: docker-compose.dev.yml for development (mounted volumes, hot-reload), docker-compose.yml using prod.Dockerfile for production
- Task shim: Makefile exposes standard tasks: build, dev, docker:dev, docker:dev:build, docker:down, docker:prod, docker:prod:build, lint, start
- CI: .github/workflows/docker-build.yml builds dev/prod images on push (does not push to registry)

## Component responsibilities

- Next.js: render UI, call API as needed. Runs `npm run dev:next` for dev, `npm run start:next` for prod.
- Express API: handles REST endpoints, reads/writes SQLite, runs on `npm run dev` in dev.
- Database: lightweight SQLite; persisted to Docker volume to survive container restarts.

## Data flow

Client -> Next.js (or direct API call) -> Express API -> SQLite
Errors are returned as HTTP error responses; API logs to stdout/stderr for container logging.

## Environment & configuration

- Env variables used: PORT, NODE_ENV, DATABASE_URL (sqlite path)
- .dockerignore excludes node_modules, .next, dist, coverage, Dockerfile*, docker-compose*.yml
- Secrets: none required now. If later adding registry pushes, CI secrets (GITHUB_TOKEN or registry creds) will be required.

## CI

- Current GH Actions workflow builds dev and prod images on push to main/master. No image push by default (build-only).
- Optional: add test step (npm test) in CI in future.

## Tasks and developer UX

- Use Makefile targets to run common workflows. Example: `make docker:dev` to start dev compose, `make docker:down` to stop.
- If desired later, add mise.yml for an interactive task menu; currently Makefile is the canonical interface.

## Persistence, backups, and volumes

- SQLite persisted in a named Docker volume (mapped to /data). Docker Compose dev uses bind mount for source code for hot-reload; production uses image-built artifacts.

## Testing & quality

- Linting via `npm run lint`. Tests run with `npm test` (Jest) but not required in CI by default.

## Deliverables

- docs/superpowers/specs/2026-06-22-docker-compose-makefile-design.md (this file)
- dev.Dockerfile, prod.Dockerfile
- docker-compose.dev.yml, docker-compose.yml
- .github/workflows/docker-build.yml
- Makefile

## Next steps

1. Self-review spec (done).
2. Please review this spec file in the repository path above and request changes if any.
3. After approval, generate an implementation plan (writing-plans) to create any remaining tasks, CI test addition, optional mise.yml, and deployment checklist.
