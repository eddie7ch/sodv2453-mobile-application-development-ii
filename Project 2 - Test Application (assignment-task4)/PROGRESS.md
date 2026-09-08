# Project 2 progress notes

Implemented (2026-09-08), done autonomously while Eddie is away — flagging
anything worth a second look rather than blocking on it.

## What was built

- Carried forward Projects 1.2 and 1.3's completed work into this repo
  first (EventsMap/EventDetails/CreateEvent, api.ts, Event type) since the
  app builds incrementally project-to-project.
- Set up Jest test infrastructure from scratch (none existed before):
  `jest-expo@^47` + `jest@^29` (versions matched to this project's Expo
  SDK 47 — the latest `jest-expo`/`jest` on npm target Expo SDK 57 and
  would have used a mismatched preset), `"test": "jest"` script,
  `"jest": {"preset": "jest-expo"}` in `package.json`.
- **Found and fixed the actual seeded bug** described in the workplace
  scenario video and Task Requirements diagram: some users get "invalid
  email" on login even with a real address. Reproduced it exactly against
  the two named users (Luigi, John) from `db.json` — see `TEST_SCRIPT.md`
  for the full reproduction steps, root cause, and fix writeup.
  - `src/utils/index.test.ts`: new unit test, written and run against the
    **unfixed** code first — 2 of 6 assertions failed, reproducing the bug
    exactly as described (confirmed via `npx jest`, output kept in the
    session transcript).
  - `src/utils/index.ts`: fixed `validateEmail`'s regex (TLD group widened
    from exactly-3-characters to 2-or-more), with a comment explaining why.
  - Re-ran the full suite after the fix: 6/6 pass.

## Verification status

- `npx jest` — all 6 tests pass (verified failing before the fix, passing
  after, per the assessment's own instructions to reproduce before fixing).
- `npx tsc --noEmit` passes clean, no type errors.
- **Not verified on an actual device/emulator** — same limitation noted in
  Projects 1.2/1.3 (no Android/iOS emulator or physical device in this
  environment). The unit test directly exercises the buggy function in
  isolation, which doesn't need a device; the *manual* re-test steps in
  `TEST_SCRIPT.md` do need one — worth actually doing that walkthrough
  before submitting, even though the logic is now covered by an automated
  test.

## Submission note

The rubric's "Debug any errors" criterion asks to "open a PR with your
fix, documenting the issue." Opened as a real GitHub PR against this repo
(see the commit right after this one) rather than just committing to
`master` directly, so there's an actual reviewable PR to point to.
