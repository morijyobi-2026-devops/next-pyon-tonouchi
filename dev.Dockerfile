cat > dev.Dockerfile <<'EOF'
FROM node:22-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Approve builds (sqlite3 等のビルドスクリプト対策)
RUN pnpm install --frozen-lockfile --ignore-scripts \
  && pnpm approve-builds \
  && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Dev start
CMD ["pnpm", "dev"]
EOF
