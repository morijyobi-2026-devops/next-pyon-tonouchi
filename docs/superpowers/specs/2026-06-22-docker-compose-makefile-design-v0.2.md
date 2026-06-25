# Project Spec v0.2: Docker Compose + Makefile for next-pyon-tonouchi

Date: 2026-06-22
Author: superpowers (assistant)
Version: v0.2

## Summary

This document updates v0.1 with practical improvements for developer ergonomics, reliability, and clarity. Changes include explicit volume and path conventions for SQLite, healthcheck and graceful-shutdown guidance, clearer env var naming and defaults, a concise developer workflow, CI notes (build-only retained), and a minimal deployment checklist.

## Goals (what this spec enables)

- Reproducible local dev and production runs using Docker Compose
- Simple, discoverable developer tasks via Makefile
- Lightweight production image suitable for Next.js static/SSR and Express API
- Persisted SQLite data across restarts with clear backup/restore guidance

## Non-goals

- Automated image publishing to registries (CI remains build-only)
- Complex multi-node production orchestration (K8s) — this is targeted at small deployments

## Architecture (high level)

- Monorepo with two primary runtimes:
  - web (Next.js) — serves UI and SSR pages on port 3000
  - api (Express) — JSON API; listens on container port 3000 and is mapped on host 3001 in dev
- Data store:
  - SQLite file persisted to a named Docker volume: pyon_sqlite_data mounted at /data/sqlite.db in api container
- Compose files
  - docker-compose.dev.yml — bind-mount source for hot reload, runs Next dev and nodemon for API
  - docker-compose.yml — production composition using prod.Dockerfile (multi-stage build) and named volumes
- Orchestration: Docker Compose for both dev and prod for parity; Makefile as the canonical local task entrypoint

## Service details

- web (Next.js)
  - Dev: npm run dev:next (hot reload), bind mount project root
  - Prod: npm run start:next (served by Next runtime)
  - Healthcheck: / (or /api/health via proxy) to confirm app responds
- api (Express)
  - Start commands: `npm run dev` (nodemon) for dev; `node src/index.js` or `npm start` for prod
  - Data path: reads/writes to process.env.DATABASE_URL or defaults to /data/sqlite.db
  - Healthcheck endpoint: GET /api/health — returns 200 {ok:true}
  - Graceful shutdown: listen to SIGINT/SIGTERM and close DB connections before exit
- db (SQLite)
  - Volume: named Docker volume pyon_sqlite_data -> container path /data
  - File path: /data/sqlite.db
  - Migration strategy: simple SQL migration files applied at container start if needed (script not included; add if schema evolves)

## Environment variables

- NODE_ENV: production | development
- PORT: port to listen (API uses container 3000 default)
- DATABASE_URL: sqlite file path (default: file:/data/sqlite.db)
- OPTIONAL: LOG_LEVEL (info|debug|warn|error)

## Dockerfile and image guidance

- dev.Dockerfile installs dev deps, mounts source, and uses npm run dev / dev:next for hot reload
- prod.Dockerfile: multi-stage build. Install production deps only, run `npm run build:next` during build if Next.js present, and expose ports 3000/3001 as needed
- Image size: keep node_modules slim by using alpine or node:20 base; multi-stage avoids dev deps in final image

## docker-compose specifics

- docker-compose.dev.yml
  - web: bind mount project root, map port 3000:3000, run `npm run dev:next`
  - api: bind mount project root, map port 3001:3000, run `npm run dev`
  - volumes: do not mount host node_modules; use anonymous volume for node_modules in container to avoid host-OS incompatibilities
- docker-compose.yml (prod)
  - use prod.Dockerfile for both services
  - named volume: pyon_sqlite_data for /data
  - do NOT bind mount source code in prod

## Healthchecks and readiness

- Add simple HTTP healthchecks in compose for each service pointing to /api/health or /\_next/health if available
- CI and orchestration should consider waiting for api healthcheck to pass before declaring success

## Logging and monitoring

- Applications log to stdout/stderr (container logs). No log aggregation here; recommend later integration with a log shipper (Fluentd/Promtail) for production
- Keep logs structured (JSON) if future aggregation is desired

## Persistence and backups

- Back up the SQLite file with `docker cp` from the running api container or `docker volume inspect` to find mount path then copy
- Example: `docker run --rm -v pyon_sqlite_data:/data -v $(pwd):/backup alpine sh -c "cp /data/sqlite.db /backup/pyon-sqlite-backup-$(date +%F).db"`

## Security considerations

- Do not commit secrets to repo. Use env files (.env) for local development; add .env.example listing required keys
- If adding registry pushes later, use GitHub secrets and least-privileged tokens
- Restrict container capabilities if hardening needed (not covered here)

## CI (GitHub Actions)

- Keep current workflow: build dev/prod images on push to main/master (build-only)
- Recommended optional steps (future): run `npm ci` and `npm test` before build; fail the job on test failures

## Developer workflow (concise)

- Local dev (quick): make dev # runs nodemon for API
- Full local dev with Next: in one terminal `npm run dev:next`, in another `make dev` for API; or `make docker:dev` to run both in containers
- Build prod image locally: make docker:prod:build
- Stop dev containers: make docker:down
- Lint: make lint

## Makefile (canonical tasks)

- Already added in repo. Keep it as the main entrypoint for developer tasks. If users prefer `mr` alias for mise, they can alias `mr='make'`.

## Deliverables (v0.2)

- Updated spec (this file)
- Existing artifacts: dev.Dockerfile, prod.Dockerfile, docker-compose.dev.yml, docker-compose.yml, .dockerignore, Makefile, .github/workflows/docker-build.yml
- Add `.env.example` (recommended next step)

## Open questions / next improvements

- Add automated tests into CI pipeline? (Recommended) — user previously chose build-only; propose adding tests later
- Migration tool for SQLite when schema changes — add if needed
- Add mise.yml for interactive task menu (optional)

## Next steps

1. Please review this v0.2 spec and request edits if any.
2. On approval, invoke the writing-plans skill to produce a prioritized implementation plan with todos, estimates, and any scripts (.env.example, healthchecks, backup script) to add.

## Spec self-review notes

- Replaced ambiguous /data path with explicit named volume pyon_sqlite_data and file /data/sqlite.db
- Clarified which commands run in dev vs prod and updated healthcheck guidance
- Called out backup example and recommended `.env.example`
