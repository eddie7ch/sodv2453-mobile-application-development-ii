# Notes on Project 4

Pulled in Project 3's work first, then built the actual deployment piece:
a workflow that fires when a GitHub Release gets published. It installs
deps, runs tests, type-checks, builds the app with `npx expo export` for
both Android and iOS (no EAS account needed, so it runs standalone in CI),
zips the output, and attaches it to the release.

One thing worth knowing if this workflow ever seems to not run: the file
has to live at the repo root (`.github/workflows/release.yml`), not
inside this project's own folder, since GitHub Actions only looks at the
real repo root and this whole thing is one monorepo. Every step scopes
into this folder with `working-directory` instead.

Ran `expo export` by hand for both platforms before trusting it in the
workflow, both worked and produced a real dist folder. Then actually
published a release to see if the whole thing worked end to end. First
try (v1.0.0) failed on the last step, attaching the zip, with "Resource
not accessible by integration". Turned out the default GITHUB_TOKEN is
read-only unless you ask for write access explicitly. Added
`permissions: contents: write`, published v1.0.1, and that one went fully
green with the zip actually attached. Left v1.0.0's failed run alone
rather than deleting it, it's a real record of what broke and got fixed.

Submission-wise: build download and release page are both the same link,
the v1.0.1 release on GitHub.
