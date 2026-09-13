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
