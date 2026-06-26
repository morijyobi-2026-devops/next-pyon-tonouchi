FROM node:22-alpine AS base

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# ① まず ignore-scripts で依存だけ入れる（sqlite3 のビルドをスキップ）
RUN pnpm install --frozen-lockfile --ignore-scripts

# ② 依存が入った状態で approve-builds を実行（ここで sqlite3 が検出される）
RUN pnpm approve-builds

# ③ もう一度 install（今度は sqlite3 のビルドが許可される）
RUN pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=base /app ./

CMD ["pnpm", "start"]
