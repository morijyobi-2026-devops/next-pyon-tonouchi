# Production Dockerfile using Node 22 and pnpm
FROM node:22-bullseye-slim AS base
WORKDIR /app

# Install pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm build

# Final image
FROM node:22-bullseye-slim AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV NODE_ENV=production
COPY --from=base /app .
RUN pnpm prune --prod
EXPOSE 3000
CMD ["pnpm","start:next"]
