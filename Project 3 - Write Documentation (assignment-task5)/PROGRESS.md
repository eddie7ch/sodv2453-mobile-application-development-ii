# Project 3 progress notes

Implemented (2026-09-08), done autonomously while Eddie is away — flagging
anything worth a second look rather than blocking on it.

## What was built

- Carried forward Project 2's completed work into this repo first,
  **including the merged bug fix** (pulled `src/utils/index.ts` and its
  test straight from the `fix/project2-invalid-email-validation` branch,
  since that fix hadn't landed on `master` yet at the time).
- **Document code** (rubric criterion): added JSDoc comments to every
  exported function in `src/utils/index.ts` and `src/services/api.ts` and
  `src/services/caching.ts` (inputs/outputs, what each one is for), to the
  two shared presentational components (`BigButton`, `Spacer` — props and
  purpose), and a "Responsibilities" doc block above each page/route
  component (`Login`, `EventsMap`, `EventDetails`, `CreateEvent`,
  `AppStack`) describing what that screen/module owns and does.
- **Document project repository** (rubric criterion): rewrote `README.md`
  from a bare "here's how to configure the fake API" note into a proper
  project README — scope/goal, requirements, full dev-environment setup
  (fake API, image upload API), run instructions for each platform, and
  how to run the test suite.

## Verification status

- `npx tsc --noEmit` passes clean, no type errors (doc comments don't
  affect this, but re-verified after adding them).
- `npx jest` — all 6 tests still pass (confirms the doc-only pass didn't
  accidentally change any logic).
- Not verified on an actual device/emulator — same limitation as prior
  projects, and not really applicable here since this project is
  documentation-only (no behavior changes).
