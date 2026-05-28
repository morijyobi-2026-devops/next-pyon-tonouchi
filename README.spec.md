# Spec v0.1

Goals:
- Add markdownlint-cli2 + lint-staged + husky to lint only committed files
- Add GitHub Actions workflow to run lint on PRs
- Add .editorconfig
- Migrate to pnpm and set minimumReleaseAge=2 days
- Pin dependency versions in package.json
- Add Renovate config to run on Mon & Thu ~05:00 JST and minimumReleaseAge 3 days
- Add .npmrc and pnpm-workspace.yaml for pnpm config
- Prepare for socket.dev security scans on PRs

Acceptance:
- Pre-commit hook runs lint-staged
- CI runs lint on PRs
- package.json uses exact versions (no ^)
- pnpm config file present
