FROM node:22-bullseye-slim AS base

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./

# ★ これを追加（必須）
RUN pnpm approve-builds

RUN pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm run build

# Production image
FROM node:22-bullseye-slim AS runner
WORKDIR /app

COPY --from=base /app ./

CMD ["pnpm", "start"]
