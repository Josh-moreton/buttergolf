# Project: buttergolf

## OpenWiki

This repository has documentation located in the /openwiki directory.

Start here:

- [OpenWiki quickstart](openwiki/quickstart.md)

OpenWiki includes repository overview, architecture notes, workflows, domain concepts, operations, integrations, testing guidance, and source maps.

When working in this repository, read the OpenWiki quickstart first, then follow its links to the relevant architecture, workflow, domain, operation, and testing notes.

## Release model (deploy ≠ merge)

- `main` is integration: merging a PR to `main` produces a **preview deploy only**. It never touches production.
- `production` is the release branch: the Vercel Production Branch points to it. Production deploys **only** when `main` is promoted (merge / fast-forward `main` → `production`).
- Promotion is an explicit, human-gated action. **Never** push, merge, or open auto-merging PRs targeting `production`.
- Database migration safety is assessed at promote time, not merge time.
