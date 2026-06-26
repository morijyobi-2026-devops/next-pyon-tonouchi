FROM node:22-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Approve build scripts（sqlite3 対策）
RUN pnpm approve-builds

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Start dev server
CMD ["pnpm", "dev"]
