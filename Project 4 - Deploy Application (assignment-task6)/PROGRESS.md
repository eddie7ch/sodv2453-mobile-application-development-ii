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

## SDK 47 to 57 upgrade

Expo Go stopped supporting SDK 47 entirely (just got "Failed to download
remote update" with no way around it), so I bumped this project to SDK 57.
Ran `npx expo install expo@^57.0.0` then `npx expo install --fix` to pull
every Expo-managed package up to a matching version.

Stuff that broke and had to get fixed after that:

- `expo install --fix` can't write to `app.config.ts` on its own since it's
  a TS file, so I added the plugins it asked for
  (`@react-native-community/datetimepicker`, `expo-font`, `expo-status-bar`)
  to the `plugins` array by hand.
- `expo-doctor` flagged `@types/react-native` as a package that shouldn't be
  installed directly anymore (types ship with `react-native` itself now), so
  I removed it. Also had to add `react-native-worklets` since
  `react-native-reanimated` 4 needs it as a peer dependency now, and bump
  `@types/react`, `@types/react-dom`, `typescript`, `jest-expo`, and
  `@types/jest` to the versions SDK 57 actually expects.
- `tsconfig.json` had `"moduleResolution": "node"` hardcoded, which fights
  with the `"moduleResolution": "bundler"` that `expo/tsconfig.base` wants
  now. Removed the override so it just inherits from the base config.
- The old top-level `splash: {...}` block in `app.config.ts` isn't valid on
  the config type anymore. Moved it into an `expo-splash-screen` plugin
  entry instead (same image, resize mode, and background color as before).
- `expo-status-bar`'s `<StatusBar>` dropped the `translucent` prop, so I
  pulled it out of the two places that used it (`App.tsx` and
  `Login.tsx`).
- `StyleSheet.absoluteFillObject` got renamed to `StyleSheet.absoluteFill`,
  fixed the two spots using it in `EventsMap.tsx`.
- `@expo/vector-icons` wasn't picked up automatically even though four files
  import from it, had to install it explicitly.
- tsc also needed `"types": ["jest"]` added to `tsconfig.json` for the test
  file to see `describe`/`test`/`expect` again (this project didn't have an
  explicit `types` array before, and without one the jest globals weren't
  resolving under the new config).

After all that, `expo-doctor` passes clean (21/21) and `npx tsc --noEmit`
has zero errors. Also ran `npx expo export --platform android` into a temp
folder by hand to make sure it still bundles the same way the release
workflow builds it, and it does.

### Release workflow

`release.yml` needed one real change: it was pinned to Node 18, but
`react-native` 0.86 (what SDK 57 pulls in) requires Node 20.19.4 or newer
and will refuse to run on anything older. Bumped the workflow's
`node-version` to 20. Didn't touch anything else in the workflow, the rest
of it (the export/zip/release-attach steps) doesn't care about the SDK
version.

One thing I couldn't fix and want to flag: `yarn test` (the "Run tests"
step in the workflow) is currently broken on SDK 57, and it's not this
project's code, it's a bug in `jest-expo` itself. When a test file pulls in
almost any Expo native module (I hit it first through `expo`'s fetch
polyfill, then again through `expo-constants`), jest-expo tries to
auto-mock it by grabbing the calling file's path out of a stack trace and
walking up folders to find its `package.json`. The stack-trace parsing
library it uses gets confused by this project's own folder name having
parentheses in it ("Project 4 - Deploy Application (assignment-task6)")
and silently strips them out of the path, so the walk-up looks in a folder
that doesn't exist and jest-expo crashes with "TypeError: The path argument
must be of type string. Received null" before any test even runs. I
confirmed this by tracing exactly where the path gets mangled. I tried
mapping the specific native modules to manual stubs to dodge it, but it
just hits the same bug on the next native module a test happens to touch,
so it's not something a couple of jest config tweaks can paper over. The
real fix would be a folder name without parentheses, which isn't something
I wanted to change unilaterally since it's the assignment folder itself.
Since GitHub Actions checks out to a path that will still contain the same
folder name, the "Run tests" step in the workflow will very likely fail the
same way in CI until this gets sorted out.

## What I learned

The first deployment failed on permissions. The workflow couldn't attach
the build to the release until I gave it `contents: write`. Reading the
Actions log line by line is what showed the real error.

Upgrades affect the pipeline too. Moving to Expo SDK 57 meant React Native
0.86, which won't run on Node 18, so the workflow had to move to Node 20.
It would have failed on the next release if I hadn't caught it.

Run the pipeline's steps locally before publishing. I ran the same install,
test, type-check, and export commands on my computer before creating
v1.1.0, so a failure would show up privately instead of as a broken public
release.

Release notes are for people, not just git. Writing out the new features
and bug fixes in the release form makes it clear what changed and why.
