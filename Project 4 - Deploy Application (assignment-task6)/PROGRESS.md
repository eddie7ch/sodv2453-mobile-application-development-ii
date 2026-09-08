# Project 4 progress notes

Implemented (2026-09-08), done autonomously while Eddie is away — flagging
anything worth a second look rather than blocking on it.

## What was built

- Carried forward Project 3's completed work into this folder (all pages,
  the bug fix, the Jest setup, the docs).
- **Deployment workflow** (`.github/workflows/release.yml`) that triggers
  automatically when a GitHub Release is published on this repo:
  1. Install deps, run tests, type-check.
  2. Build the application files via `npx expo export` (Android + iOS
     bundles — this needs no EAS account/credentials, so it runs
     standalone in CI without any of Eddie's Expo login).
  3. Zip the build output and attach it to the release as a downloadable
     asset via `softprops/action-gh-release`.

## Important placement note (read this if the workflow doesn't seem to run)

**This workflow file lives at the repo root** (`.github/workflows/release.yml`),
**not inside this project's own folder** — GitHub Actions only ever
discovers workflows under `.github/workflows/` at the actual repository
root, and since this whole assessment is one monorepo (all 6 projects as
subfolders under one repo), a copy placed inside
`Project 4 - Deploy Application (assignment-task6)/.github/workflows/`
would silently never run. Every step in the workflow scopes into this
project's folder via `working-directory` instead of `cd`-ing manually.

If this repo ever gets split back into one-repo-per-project, move
`.github/workflows/release.yml` from the repo root down into this
folder's own root and drop the `working-directory` / path-prefixing.

## Verification status

- Locally ran `npx expo export --platform android` and
  `npx expo export --platform ios` by hand before writing them into the
  workflow — both succeed and produce a real `dist/` folder (~5-7 MB),
  confirmed the command actually works on this Expo SDK version rather
  than assuming it does.
- Validated the workflow YAML parses correctly (`python -c "import yaml..."`).
- **Not yet triggered for real** — this needs an actual GitHub Release to
  be published on the repo to fire, which is the next step (see below).
  Once triggered, check the Actions tab for the run and fix anything that
  breaks in the real CI environment vs. this local one (that's explicitly
  part of the rubric — "troubleshoot and fix any issues that arise during
  the deployment process").

## Submission note

The rubric's "Trigger automated deployment" criterion asks to "fill in
[the] release form" and "describe new features and bugfixes" — i.e.
actually publish a GitHub Release (not just write the workflow and leave
it unfired). Planning to do that next and confirm the run succeeds,
troubleshooting anything that fails.
