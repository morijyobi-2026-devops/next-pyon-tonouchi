# pnpm migration notes

- pnpm is the recommended package manager for this repo.
- To migrate locally:
  - Install pnpm (preferred): corepack enable && corepack prepare pnpm@latest --activate
  - Or: npm i -g pnpm@latest
  - Run: pnpm install
- Settings:
  - minimum-release-age: 2880 (2 days) set in .npmrc to avoid installing very recent releases.
- CI: workflows use pnpm/action-setup to install pnpm and pnpm install --frozen-lockfile
