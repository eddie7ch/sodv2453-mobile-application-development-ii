# Notes on Project 2

Set up Jest from scratch since nothing was configured. Had to pin jest-expo to ^47 and jest to ^29 to
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

## Second pass: a wider range of scenarios

Went back over the brief and rubric. The first version only tested the one
case from the ticket, and the rubric's top level asks for a wide range of
scenarios in the unit tests, the manual testing and the debugging.

Testing more addresses turned up more than the ticket said. The old check
also rejected `.co`, `.ca`, `.info` and `.museum`, and a second cause: `+`
and apostrophes weren't allowed before the @, so `bob+news@gmail.com` was
rejected too. Fixed both, and removed a leftover `123;` line in Login.tsx.

Unit tests went from 6 to 39. They cover all 10 seeded users, 9 other real
address shapes, 11 invalid ones, and the login screen itself with the API,
cache and navigation mocked. Ran them against the original code first: 16
fail. With the fix, all 39 pass.

Manual test script now has 8 scenarios, all run on my phone and passing.
It also has a findings section, including one I tripped over myself: if you
don't log out between tests, the app skips the login screen and it looks
like a wrong password worked.

Libraries added, both dev only so they don't end up in the app:
`@testing-library/react-native` to render and tap the login screen in a
test, and `test-renderer`, which it needs to run.

## What I learned

Reproduce the bug before fixing it. I wrote the failing test first, so I
knew the test actually caught the problem and wasn't just passing by
accident.

The bug only showed up with the right data. Most seeded users had .com
emails, so the regex looked fine. Luigi's .it and John's .com.br were what
exposed it. Tests should include the unusual cases, not just the common one.

Test the case that used to work, too. Checking Ulla's normal .com address
made sure widening the regex didn't break anything else.

Unit tests aren't the whole story. After the tests passed, I still logged
in as all three users on my phone to confirm the fix works in the real app.

Tooling breaks in weird ways. The folder name having parentheses broke
jest-expo after the SDK upgrade. I learned how to patch a dependency with
patch-package so the fix sticks after every install.

Mock what the screen depends on, not the screen. Faking the API, cache and
navigation let me test the real login screen without json-server running.

A test that passes can still be testing the wrong thing. When wrong
passwords seemed to log me in, the server log showed they never even
reached it. I was still logged in. Checking the evidence first saved me
from "fixing" a bug that didn't exist.
