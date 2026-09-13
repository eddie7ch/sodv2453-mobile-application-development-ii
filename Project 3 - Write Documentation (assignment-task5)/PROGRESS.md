# Notes on Project 3

Pulled in Project 2's work, including the email fix (grabbed it off the
fix branch directly since it hadn't landed on master yet at the time).

Two things this project grades: documenting the code and documenting the
repo itself.

For the code side, added comments to the exported functions in
utils/index.ts, api.ts, and caching.ts, to BigButton and Spacer, and a
short note above each screen (Login, EventsMap, EventDetails, CreateEvent,
AppStack) on what it's actually responsible for.

For the repo side, the README was basically just "here's how to set up
the fake API" before. Rewrote it properly: what the app is, requirements,
full setup for both the fake API and image uploads, how to run it on each
platform, how to run the tests.

Types still check clean and all 6 tests still pass, so the doc pass
didn't break anything. No device to test this on, but that doesn't really
apply here anyway since nothing behavioral changed.

Also had to bump this project from Expo SDK 47 to SDK 57, since Expo Go
dropped support for SDK 47 and the app would only fail with "Failed to
download remote update" now. Ran `expo install expo@^57.0.0` then
`expo install --fix` to bring every Expo package along, then chased down
what expo-doctor and tsc flagged:

- moved the `splash` block out of app.config.ts and into the
  expo-splash-screen plugin, since ExpoConfig doesn't accept a top-level
  splash key anymore
- added the plugins expo install --fix couldn't write itself (datetimepicker,
  expo-font, expo-status-bar, expo-splash-screen) to app.config.ts by hand
- dropped `@types/react-native` (bundled with react-native now) and added
  the new `react-native-worklets` peer dependency reanimated 4 needs
- bumped @types/react, @types/react-dom, @types/jest, jest-expo and
  typescript to the versions SDK 57 expects
- removed the explicit `moduleResolution: node` in tsconfig.json so it
  picks up the bundler resolution expo's base config wants
- added a "types": ["jest", "node"] entry to tsconfig.json, the test file's
  describe/test/expect globals weren't resolving without it
- dropped the now-removed `translucent` prop off both `<StatusBar>` usages
  (App.tsx and Login.tsx)
- renamed `StyleSheet.absoluteFillObject` to `StyleSheet.absoluteFill` in
  EventsMap.tsx
- installed `@expo/vector-icons` directly since expo install --fix didn't
  pull it in even though four files import from it

expo-doctor passes 21/21, tsc --noEmit is clean, and `expo export` bundles
fine for Android. Didn't touch any of the doc comments beyond what these
fixes needed.
