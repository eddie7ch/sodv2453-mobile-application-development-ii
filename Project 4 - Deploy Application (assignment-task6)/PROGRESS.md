# Notes on Project 4

Jeremy's ticket: when a release is published on GitHub, run the unit tests and,
if they all pass, build the binary files the deployment team needs for the App
Store and Google Play. Then send the download link and the release page.

## The workflow

`.github/workflows/release.yml` (at the repo root, since GitHub only reads
workflows from there and this repo holds every project).

1. **Run unit tests:** installs dependencies, runs the 33 Jest tests and the
   TypeScript check. The build jobs depend on this one, so a failing test
   stops everything.
2. **Build Android:** generates the native project with `expo prebuild` and
   builds a release APK (installs on a phone) and AAB (what Google Play takes)
   with Gradle.
3. **Build iOS:** generates the native project and builds a Release app with
   `xcodebuild` for the iOS Simulator. Signing for the App Store needs the
   Apple Developer account, which the deployment team owns, so it's unsigned.
4. **Attach binaries to the release:** uploads all three files to the release
   page under Assets.

Android and iOS build at the same time. There's also a "Run workflow" button
to try a build without publishing a release.

The tests are Project 2's email validation suite, along with its final fix.

## Troubleshooting

My first version of this workflow only ran `expo export`, which makes
JavaScript bundles, not binaries. The store team can't upload those, so I
rebuilt it. Getting real builds working took a few tries:

- **iOS: no bundle identifier.** `expo prebuild` stopped because it can't
  write one into `app.config.ts`. Added `com.eddie7ch.volunteam4deploy`.
- **iOS: ExpoModulesJSI build script failed.** I first thought it was the
  spaces and brackets in the project folder name, so both builds now copy the
  app to `$HOME/volunteam`. That wasn't it. The log (once I stopped cutting it
  off with `tail`) showed it couldn't resolve its Swift packages. Expo SDK 57
  needs a newer Xcode than the `macos-15` runner has, and it built on
  `macos-26`.
- **Android: over an hour and still compiling.** It was compiling native code
  for four CPU types. Building arm64 only (what every current Android phone
  uses) still crawled. Gradle's default 2 GB of memory turned out to be the
  real problem. With 6 GB it finished in about 12 minutes.
- **Android: my memory fix broke the build.** I appended the setting to
  `gradle.properties`, but the file has no newline at the end, so it got
  glued onto the last setting. Passing it on the command line fixed it.

## What I learned

Read the full log before guessing. I spent a run fixing the folder name when
the real error was a few lines up, hidden by my own `tail`.

Slow isn't the same as stuck. Cancelling the long Android build showed it was
still making progress, which pointed at resources rather than a hang.

Try the pipeline before the real release. The manual trigger let me break and
fix it privately instead of publishing a pile of failed releases.
