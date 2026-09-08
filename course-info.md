# SODV2453-01 Mobile Application Development II — Bow Valley College

- Instructor: Dima Marachi — MS Teams or dmarachi@bowvalleycollege.ca
- D2L course home: https://d2l.bowvalleycollege.ca/d2l/home/485439 (org unit id 485439)
- Stack: React Native (mobile UI, style sheets, Flexbox, touch handling, custom components), .NET 6 backend
- Term: Fall 2026, **September 1 – December 18, 2026** (per bowvalleycollege.ca "Important Dates" — this is the BVC-wide Fall term end, not a course-specific date; the course's own 15-week schedule below fits inside it)
- Total assessed items: **6** — Project 1.1, 1.2, 1.3 (parts of "Project 1"), Project 2, Project 3, Project 4. Per the Assessment Overview page: "This Competency Assessment has 4 Projects. The first project has 3 parts within it."
- Grading weight (from Course Outline PDF): **Projects 90%, Professionalism 10%**. Minimum grade of D (50%) to pass; min GPA 2.0 to graduate (standard BVC policy, not course-specific)
- Point totals per Dropbox listing (2026-09-07): Project 1.1 = /9, Project 1.2 = /15, Project 1.3 = /6, Project 2 = /9, Project 3 = /6, Project 4 = /6
- **Only Project 1.1 has a due date published so far** (Sep 17, 2026, 11:59 PM) — confirmed via both the Dropbox page and Content > Course Schedule > Full Schedule (which lists every dated item across the whole course; as of 2026-09-07 it shows exactly one entry, Sep 17). Projects 1.2 onward have no due date yet — check back as the term progresses.

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
