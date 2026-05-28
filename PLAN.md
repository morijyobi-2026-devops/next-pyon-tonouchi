Plan v0.1

1. Pin dependency versions in package.json (remove ^)
2. Add husky pre-commit hook that runs lint-staged
3. Add GitHub Actions workflow to run lint on pull_request
4. Add .editorconfig
5. Add pnpm-workspace.yaml and .npmrc (minimum-release-age=2 days)
6. Add renovate config (.github/renovate.json) with schedule and minimumReleaseAge=3 days
7. Test: run npm ci and npm run lint:md locally, open a PR to ensure Actions runs

Notes:
- Will not pin GitHub Actions to SHAs in this change; recommend pinning later (requires fetching action SHAs).
- Socket.dev is already installed in org; PRs will get scans automatically when renovate creates them.
