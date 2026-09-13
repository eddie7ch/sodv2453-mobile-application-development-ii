# Notes on Project 2

Pulled 1.2 and 1.3's work in first, then set up Jest from scratch since
nothing was configured. Had to pin jest-expo to ^47 and jest to ^29 to
match this project's actual Expo SDK version, the latest jest-expo on npm
targets SDK 57 and would've silently used the wrong preset.

Found the actual bug the workplace scenario was pointing at: Luigi and
John can't log in, "invalid email" even though their addresses are real.
Wrote a failing test first against the unfixed code (2 of 6 assertions
failed, which matched the bug exactly), then fixed validateEmail's regex
and got all 6 passing. Full writeup with the root cause is in
TEST_SCRIPT.md.

Tests pass, types check clean. Haven't actually run the app on a device
to walk through the manual reproduction steps in TEST_SCRIPT.md though,
that part still needs doing before this counts as fully verified, the
unit test covers the logic but not the real login screen.

Opened this as a PR instead of just committing to master since the
rubric specifically wants a PR documenting the fix.

Later had to upgrade the whole project from Expo SDK 47 to SDK 57, because
the current Expo Go app on my phone won't run SDK 47 anymore ("Failed to
download remote update"). Ran `npx expo install expo@^57.0.0` then
`npx expo install --fix` to bring all the expo-* packages along, then
worked through `expo-doctor` and `tsc --noEmit` until both came back clean.
Along the way: dropped `@types/react-native` (types ship with react-native
itself now), added the missing `react-native-worklets` peer dep for
reanimated, moved the old `splash` block in app.config.ts into the
expo-splash-screen plugin instead, dropped the `translucent` prop from
the two `<StatusBar>` usages (removed in the new expo-status-bar), and
swapped `StyleSheet.absoluteFillObject` for `StyleSheet.absoluteFill` in
EventsMap.tsx. Also had to explicitly install `@expo/vector-icons` since
`expo install --fix` didn't pick it up on its own even though several
screens import it.

Had to bump the Jest setup too since jest-expo ^47 obviously doesn't know
about SDK 57. Moved to jest-expo ~57.0.5 and pulled in
`@react-native/jest-preset` (jest-expo now expects it as a separate peer
dependency instead of bundling it). Hit one more snag after that: jest-expo
tries to build native-module mocks by walking the stack trace back to the
file that called `requireNativeModule`, and that walk silently breaks
because our project folder name has parentheses in it
("...(assignment-task4)") which get stripped somewhere in the stack trace
library, so it can never find the enclosing package.json and crashes
instead of returning null like it's supposed to when a mock is missing.
Since renaming the folder isn't an option, patched jest-expo with
patch-package (added a `postinstall` script so the patch reapplies after
every install) to add the missing null check, and added a small
jest.setup.js that locks in Node's built-in `fetch` before jest-expo's own
setup runs, so Expo's fetch polyfill installer skips over it instead of
tripping the same bug. Everything under `src` still needed zero changes
for tsc or tests, this was all tooling/config.

All 6 tests still pass after the jest-expo bump, `tsc --noEmit` is clean,
`expo-doctor` is 21/21, and `expo export --platform android` bundles fine.

Tested it on a real phone after all that. Pointed the api at my computer's
LAN IP and moved three of the seeded events to future dates (they were
2022/2023, so the map was hiding them as past events). Logged in as Luigi,
John, and Ulla, and all three worked. Details are at the bottom of
TEST_SCRIPT.md.
