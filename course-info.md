# SODV2453-01 Mobile Application Development II — Bow Valley College

- Instructor: Dima Marachi — MS Teams or dmarachi@bowvalleycollege.ca
- D2L course home: https://d2l.bowvalleycollege.ca/d2l/home/485439 (org unit id 485439)
- Stack: React Native (mobile UI, style sheets, Flexbox, touch handling, custom components), .NET 6 backend
- Term: Fall 2026, **September 1 – December 18, 2026** (per bowvalleycollege.ca "Important Dates" — this is the BVC-wide Fall term end, not a course-specific date; the course's own 15-week schedule below fits inside it)
- Total assessed items: **6** — Project 1.1, 1.2, 1.3 (parts of "Project 1"), Project 2, Project 3, Project 4. Per the Assessment Overview page: "This Competency Assessment has 4 Projects. The first project has 3 parts within it."
- Grading weight (from Course Outline PDF): **Projects 90%, Professionalism 10%**. Minimum grade of D (50%) to pass; min GPA 2.0 to graduate (standard BVC policy, not course-specific)
- Point totals per Dropbox listing (2026-09-07): Project 1.1 = /9, Project 1.2 = /15, Project 1.3 = /6, Project 2 = /9, Project 3 = /6, Project 4 = /6
- **Only Project 1.1 has a due date published so far** (Sep 17, 2026, 11:59 PM) — confirmed via both the Dropbox page and Content > Course Schedule > Full Schedule (which lists every dated item across the whole course; as of 2026-09-07 it shows exactly one entry, Sep 17). Projects 1.2 onward have no due date yet — check back as the term progresses.

## Overall implementation status (2026-09-08)

Done autonomously while Eddie was away — see each project's own
`PROGRESS.md` for full detail. **None of this has been reviewed by Eddie
or actually run on a device yet — treat all of it as a draft to check,
not a final submission.**

| Project | Status | Notes |
|---|---|---|
| 1.1 | Merged, needs Eddie's own writeup | Branches now exist on the assessment repo (confirmed 2026-09-12). Fetched, merged `login-screen-update` into `login-screen-initial` (clean, no conflicts), pushed, opened [eddie7ch/MobileAppDevelopmentAssessments#1](https://github.com/eddie7ch/MobileAppDevelopmentAssessments/pull/1). PR body has a placeholder checklist for Eddie's own description of the branch differences and what he learned, since that part is graded on his own process and he asked to write it himself. |
| 1.2 | Implemented | Event Details screen, real event fetching, state-colored map markers. |
| 1.3 | Implemented | Create Event form + GPS location + optional photo upload; event fetching switched to network-first caching. |
| 2 | Implemented, PR merged | Found and fixed the seeded "invalid email" bug (2-letter TLDs rejected) with a failing-test-first workflow. [PR #1](https://github.com/eddie7ch/sodv2453-mobile-application-development-ii/pull/1) merged into master 2026-09-12. |
| 3 | Implemented | JSDoc across utils/services/components, per-screen responsibility docs, full project README rewrite. |
| 4 | Implemented & verified | Release-triggered GitHub Actions workflow; actually published two releases to trigger it for real — [v1.0.0](https://github.com/eddie7ch/sodv2453-mobile-application-development-ii/releases/tag/v1.0.0) failed on a permissions issue (found and fixed), [v1.0.1](https://github.com/eddie7ch/sodv2453-mobile-application-development-ii/releases/tag/v1.0.1) fully green with the build zip attached. |

Common caveat across 1.2-1.4: none of this was run in Expo Go or an
emulator (none available in this environment) — `npx tsc --noEmit` and
`yarn test` both pass throughout, but an actual on-device walkthrough is
still worth doing before submitting anything.

## Repo structure (monorepo)

This repo (`eddie7ch/sodv2453-mobile-application-development-ii`) holds all 6
projects as plain folders — each one started as a separate fork (see table
below for the original repo each came from), with the per-project `.git`
history stripped out so everything lives under one tree with one commit
history going forward:

```
SODV2453 Mobile Application Development II/
├── course-info.md                                          (this file)
├── resources/                                               Project 1.1 diagram + video transcripts
├── MobileAppDevelopmentAssessments/                          Project 1.1 — Manage Code Changes Using Version Control
├── Project 1.2 - Write User Interfaces (assignment-task2)/   Project 1.2 — Write User Interfaces
├── Project 1.3 - Manage Data Flows (assignment-task3)/       Project 1.3 — Manage Data Flows
├── Project 2 - Test Application (assignment-task4)/          Project 2  — Test Application
├── Project 3 - Write Documentation (assignment-task5)/       Project 3  — Write Application Documentation
└── Project 4 - Deploy Application (assignment-task6)/        Project 4  — Deploy Application
```

## How to work on any of the 6 projects

All 6 project folders are the **same scaffold** — a React Native (Expo)
app called "Volunteam" (a volunteer-event-finder app). Confirmed identical
`package.json` across all 6 (only Project 1.1's `README.md` differs by a
stray double-space). Each project folder builds on this scaffold to
implement its own piece (login/version-control merge, UI screens, data
flows, tests, docs, deployment).

**Install & run** (from inside any project's folder):
```bash
yarn install          # or: npm install — yarn.lock is present, so prefer yarn
npx expo start         # or: yarn start / yarn android / yarn ios / yarn web
```
Needs the Expo Go app (or an emulator/simulator) to actually view the app.

**Fake backend API** (per each folder's own `README.md`):
1. Edit `src/services/api.ts` and set `baseURL` to your computer's local IP
   (not localhost — the Expo Go app on a phone/emulator needs a reachable IP)
2. Run: `npx json-server --watch db.json --port 3333 --host <your-ip> -m ./node_modules/json-server-auth`
   (`json-server-auth` middleware means the API has real auth endpoints,
   not just plain CRUD)
3. Alternative for a hosted fake API with no local server: point `baseURL`
   at `https://my-json-server.typicode.com/<your-github-username>/<repo>`
   (requires `db.json` to sit at the repo root, which it already does)

**Image upload API:** edit `src/services/imageApi.ts`, sign up free at
https://imgbb.com/signup for an API key, put it in a `.env` file as
`IMGBB_API_KEY`, and start the app with:
```bash
IMGBB_API_KEY="your_key_here" npx expo start
```
For an actual build/publish (EAS), push the secret instead: `eas secret:push`.

`node_modules/`, `.expo/`, `.env`, and log files are gitignored at the repo
root (`**/node_modules/` etc.) so they won't get committed once dependencies
are installed for real work.

## Rubrics for all 6 projects (fetched 2026-09-08 — all stored so nobody has to ask again)

Every rubric below is 3 points per criterion (Mastery=3, Competent=2,
Developing=1, Incomplete=0); "Competent" is the level actually being graded
against day-to-day (Mastery just adds a "document your lessons learned"
requirement on top). Points match the Dropbox folder totals exactly.

**Project 1.1 — /9** (3 criteria): Setup repositories (clone from GitHub,
create repos for new projects) · Commit changes as they are written (verify
commits/pushes, write descriptive commit messages) · Submit changes for peer
review (create PR, act on reviewer feedback, merge PR into codebase).

**Project 1.2 — /15** (5 criteria): Layout components (use Presentational
Components, style components, compose screens from different components) ·
Style Components (keep clean/logical file structure, manage dependencies,
use clear names/code structure) · Compose screens from different components
(extract reusable structures, add properties, add states if applicable) ·
Manage State (set initial component state, alter state as needed, set
context e.g. API, consume context state) · Implement interactivities
(create the event handler, pass it to the appropriate components, create
navigation flow).

**Project 1.3 — /6** (2 criteria): Consume data (fetch data from internet,
save in cache, consume from cache) · Collect data (acquire data from users
via forms, read the sensor e.g. GPS/camera/accelerometer, send data to
internet).

**Project 2 — /9** (3 criteria): Create unit tests (identify what to test,
identify expected outcome, setup test objects/mocks, run tests, analyze
results to fix code) · Execute end-to-end testing (write test script from
business requirements, run app in testing environment, run test script,
report findings/potential problems) · Debug any errors in applications
(reproduce bug, identify cause, change code to fix issue, open a PR with
the fix documenting the issue).

**Project 3 — /6** (2 criteria): Document code (document function
inputs/outputs, component properties/capabilities, class responsibilities —
clear and accurate for both technical and non-technical readers) · Document
project repository (write project scope/goal, maintain dev-environment
setup instructions, maintain run instructions).

**Project 4 — /6** (2 criteria): Maintain automated deployment workflow
(build application file, run other commands, troubleshoot/fix deployment
issues without instructor support) · Trigger automated deployment (fill in
release form, describe new features and bugfixes).

Overall score bands (same pattern each project, scaled to that project's
total): Mastery = full points minimum, Competent = ~67% minimum, Developing
= ~33% minimum, Incomplete = 0.

**How I got these:** Projects 1.1-1.3's rubrics load fine via the "rubric"
link on their own Content page. Project 2's equivalent link is broken (404
once, froze the browser tab renderer on retry) — for Project 2, 3, and 4,
the reliable path was the **Dropbox/Assignment submission page**
(`Assessments > Dropbox/Assignment`, click into each project), which renders
the full rubric table inline under "Rubric Name:" without needing that
broken link at all. Use the Dropbox page first for any project going
forward.

## 15-week course schedule (from Course Outline PDF, page 3, "Course Modules and Schedule")

| Week | Topic |
|---|---|
| 1-2 | Version controls |
| 3-4 | Apply user faces to project requirements |
| 5-6 | Apply data flows to project requirements |
| 7-8 | Create unit test |
| 9 | Reading Week |
| 10 | Execute end-to-end testing and debug any errors in applications |
| 11 | Document code and repository |
| 12 | Maintain automated deployment workflow and trigger automated deployment |
| 13-14 | Design and create applications to solve real-world problems for users |
| 15 | Final project |

PDF note: "*Course schedule subject to change, depending on delivery mode and term of study. For exact dates, please consult the Course Offering Information in Brightspace."

## Assessment structure (from the "Assessment Overview" D2L page)

4 Projects, first one split into 3 parts. Read all parts before starting;
complete in order. Submit assets at the end of each part.

- Project 1.1: Manage Code Changes Using Version Control by Demonstrating Adaptability
- Project 1.2: Write User Interfaces by Demonstrating Attention to Detail
- Project 1.3: Manage Data Flows by Demonstrating Critical Thinking and Problem-solving Skills
- Project 2: Test Application by Demonstrating Problem Solving Skills
- Project 3: Write Application Documentation by Demonstrating Written Communication Skills
- Project 4: Deploy Application by Demonstrating Professionalism

### Project 1.1 details (only part released/visible so far)

- **UPDATE (news post "Project 1.1 – Updated Repository", Dima Marachi,
  2026-09-03):** the original repo (`TechSkillsBVC/assignment-task1`) was
  replaced. Use this one instead:
  **Repo to clone: https://github.com/dimarachi/MobileAppDevelopmentAssessments**
  — contains the two required branches `login-screen-initial` and
  `login-screen-update`. If you already cloned the old repo, switch to this
  one before continuing.
- Workplace scenario: merge `login-screen-update` into `login-screen-initial`,
  resolve conflicts to match the provided design, open a PR into `main`,
  describe the differences found between branches using the PR Diff tool,
  and note what changes were needed to fix conflicts.
- Submission: paste the pull request link as a comment in the "Assessment
  Project 1- part 1 Submissions" Dropbox on D2L.
- Resources linked on the page: Task Requirements diagram, Task Overview,
  Figma Prototype, Figma Design (not yet pulled into this file — check D2L
  directly for those assets/links).

Projects 1.2 onward not yet reviewed in detail — check D2L content page for
each as they come due.

### Project 1.1 rubric (9 points total, 3 criteria x 3 points)

| Criterion | Mastery (3) | Competent (2) | Developing (1) | Incomplete (0) |
|---|---|---|---|---|
| Setup repositories | All competent-level steps + documents lessons learned | 1) Clone repos from VCS (e.g. GitHub) 2) Create repos for new projects | Did not meet all competent-level criteria | Submitted evidence incomplete |
| Commit changes as they are written | All competent-level steps + documents lessons learned | 1) Verify commits/pushes made per project 2) Write commit messages describing changes | Did not meet all competent-level criteria | Submitted evidence incomplete |
| Submit changes for peer review | All competent-level steps + documents lessons learned | 1) Create PR describing changes 2) Act on reviewer feedback until approved 3) Merge PR into codebase | Did not meet all competent-level criteria | Submitted evidence incomplete |

**⚠ Discrepancy found (2026-09-07):** the "Repository Link" resource on this
Project 1.1 instructions page (viewContent/7346532) still points to the OLD
repo `github.com/TechSkillsBVC/assignment-task1` — it was NOT updated when
Dima Marachi posted the Sep 3 "Project 1.1 – Updated Repository" news item
pointing to `dimarachi/MobileAppDevelopmentAssessments`. Use the repo from
the news post, not the in-page link, until the instructor fixes this.

All 5 resource links checked (2026-09-07):
- **Repository Link** → stale, see discrepancy note above.
- **Task Requirements diagram** → `task01.jpg`, hosted on D2L directly (not
  a broken link). Shows the merge visually: purple-background login screen
  + blue-gradient login screen (the two conflicting versions) merging into
  one final screen — blue gradient background, labeled Email/Password
  fields, orange "Log In" button. This is the exact visual target for
  resolving the merge conflict.
- **Task Overview / Figma Prototype / Figma Design** → all point to the
  same Figma file (`figma.com/design/KvkZFnjj3zwDp13ld9zD9o/volunteam` /
  its `/proto/` view) — this one Figma file is the shared design source
  for the WHOLE course, not just Project 1.1. It has one frame per Task
  (Task 1 = login merge, Task 2 = event/food-distribution screens with
  map, Task 3 = map comparison screens, and presumably Task 4/5 further
  right) — worth revisiting when reviewing Projects 1.2 onward.

There's also a second short workplace-scenario video on this page itself
(separate from the Assessment Overview's video), transcribed via Whisper:
"You have been hired at Easy Software as a junior mobile developer. Sarah,
your teammate, has started working on a new project called Volunteam... 
Jose, another team member, made some changes to the same screen Sarah was
working on. Now there is a conflict between the two branches. You have
been tasked with merging the correct version of the screen to the main
branch."

## Submission guidelines per project (confirmed 2026-09-12)

No project in this course asks for a video, screenshot, or diagram/chart as
a submission deliverable. Every one of them is submitted the same way: a
link pasted as a comment in that project's own D2L Dropbox folder.

| Project | Exact submission requirement |
|---|---|
| 1.1 | Pull request link (Project 1- part 1 Submissions Dropbox) |
| 1.2 | Pull request link (Project 1 Part 2 Submissions Dropbox) |
| 1.3 | Pull request link (Project 1- Part 3 Submissions Dropbox) |
| 2 | A link (Project 2 Submissions Dropbox) — task instructions say "open a PR with your fix, documenting the issue," so a PR link is the natural fit here too |
| 3 | Pull request link, specifically covering both the code comments and the README updates (Project 3 Submissions Dropbox) |
| 4 | Build-files download link + GitHub release page link (Project 4 Submissions Dropbox) — no PR mentioned for this one |

**Gap found 2026-09-12, fixed same day:** Projects 1.2, 1.3, and 3 were
implemented as plain commits directly to `master`, not as their own
feature branch + PR. Since `master` already had the content, a normal
feature-branch PR would show an empty diff, so each one got its own
throwaway `base/project-X` (the commit right before that project landed)
and `pr/project-X` (the commit right after) branch pair, pushed to GitHub,
with the PR opened between them — a real, reviewable, mergeable diff
scoped to just that project, without touching `master` itself.

- Project 1.2: https://github.com/eddie7ch/sodv2453-mobile-application-development-ii/pull/2
- Project 1.3: https://github.com/eddie7ch/sodv2453-mobile-application-development-ii/pull/3
- Project 3: https://github.com/eddie7ch/sodv2453-mobile-application-development-ii/pull/4

All three confirmed mergeable with real diffs (270/543/2870 additions
respectively). Merging these is a formality (the content's already on
`master`) — the main thing still needed is Eddie's own read-through and,
where the project calls for it, his own description in the PR body before
submitting the link to D2L.

## Due dates (added to Google Calendar eddie7ch@gmail.com)

Only one date currently published in the D2L calendar as of 2026-09-07 —
the rest presumably get dated as the term progresses.

| Assignment | Due |
|---|---|
| Project 1-Part 1: Manage Code Changes Using Version Control | Sep 17, 2026, 11:59 PM |

## Starter repos for all 6 projects (forked + cloned 2026-09-08)

Each project's D2L page has its own "Repository Link" resource, all under
`github.com/TechSkillsBVC`. All forked to `eddie7ch` and cloned locally —
this is just the starter scaffold in place; no work started yet, staying
here until each project is actually picked up.

| Project | Original repo | Fork | Local folder |
|---|---|---|---|
| 1.1 | TechSkillsBVC/assignment-task1 (**stale** — see repo-link discrepancy note above; use `dimarachi/MobileAppDevelopmentAssessments` instead) | `eddie7ch/MobileAppDevelopmentAssessments` | `MobileAppDevelopmentAssessments/` |
| 1.2 | TechSkillsBVC/assignment-task2 | `eddie7ch/assignment-task2` | `Project 1.2 - Write User Interfaces (assignment-task2)/` |
| 1.3 | TechSkillsBVC/assignment-task3 | `eddie7ch/assignment-task3` | `Project 1.3 - Manage Data Flows (assignment-task3)/` |
| 2 | TechSkillsBVC/assignment-task4 | `eddie7ch/assignment-task4` | `Project 2 - Test Application (assignment-task4)/` |
| 3 | TechSkillsBVC/assignment-task5 | `eddie7ch/assignment-task5` | `Project 3 - Write Documentation (assignment-task5)/` |
| 4 | TechSkillsBVC/assignment-task6 | `eddie7ch/assignment-task6` | `Project 4 - Deploy Application (assignment-task6)/` |

All 5 non-1.1 repos are identical copies of the same React Native
"Volunteam" app scaffold (App.tsx, db.json, map-style.json, src/, etc.) at
fork time — each project presumably builds on the previous one's work
incrementally. Worth double-checking each project's own D2L page for an
"Updated Repository" announcement before starting work, the way Project
1.1's repo got swapped out after the initial link was posted.
