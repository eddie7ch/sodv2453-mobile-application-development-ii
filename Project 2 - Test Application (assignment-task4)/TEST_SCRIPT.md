# Test script: "Invalid email" login bug

## Bug report

Ray from QA moved the ticket to "Failed". Some users can't log in because the app
says "invalid email" when they type their address, even though it's a real one.
It doesn't happen to everyone. Luigi (`luigi@carluccio.it`) and John
(`john@silva.com.br`) are two users who hit it.

## Business requirement

Anyone with a real, correctly formatted email address and the right password
should be able to log in and reach the events map. Addresses that aren't valid
email addresses should be stopped on the login screen with "invalid email".

## Test environment

- App on an Android phone (Pixel) through the Expo development build, connected
  to Metro on the same Wi-Fi.
- Fake API: `npx json-server --watch db.json --port 3333 --host <ip> -m ./node_modules/json-server-auth`
- Every seeded user's password is `123456`.
- Before each scenario: log out from the map (top right button), then clear
  both fields on the login screen. The app remembers the last login, so
  skipping this makes it jump straight to the map.

## Scenarios

Steps for each: type the email, type the password, tap **Log in**.

| # | Email | Password | Expected result |
|---|---|---|---|
| 1 | `luigi@carluccio.it` | `123456` | Logs in, events map shows |
| 2 | `john@silva.com.br` | `123456` | Logs in, events map shows |
| 3 | `ulla.ulriksen@example.com` | `123456` | Logs in, events map shows (address that always worked) |
| 4 | `  JOHN@Silva.COM.BR ` (capitals and spaces) | `123456` | Logs in, events map shows |
| 5 | `bob+volunteam@example.com` | `123456` | Logs in, events map shows |
| 6 | `luigi@carluccio` | `123456` | Red "invalid email", stays on login |
| 7 | `luigi@carluccio.it` | `123` | Red "invalid password", stays on login |
| 8 | `luigi@carluccio.it` | `wrongpass` | "Authentication Error" pop-up, stays on login |

`bob+volunteam@example.com` is a test user I added to `db.json` for scenario 5.

## Reproducing the bug (before the fix)

Reproduced first with the unit tests below, run against the original
`validateEmail`: the addresses in scenarios 1, 2, 4 and 5 are all rejected, so
the Email field turns red with "invalid email" and nothing is sent to the
server. Scenarios 3, 6, 7 and 8 behave as expected. This matches the task
diagram, where Luigi gets "invalid email" and a normal address reaches the map.

## Root causes

Both were in `validateEmail` in `src/utils/index.ts`, which the login screen
runs before calling the server.

1. **The domain ending had to be exactly 3 characters.** The regex ended in
   `(\.\w{3})+`, so every part after the first dot in the domain had to be 3
   characters long. `luigi@carluccio.it` (`.it`) and `john@silva.com.br`
   (`.br`) failed, and so did other real addresses like `.co`, `.ca`, `.info`
   and `.museum`. Everyone else in the seeded data uses `.com`, which is why
   only some users were affected.
2. **The name part didn't allow `+` or apostrophes.** Before the `@`, only
   letters, digits, `_`, dots and dashes were allowed, so real addresses like
   `bob+news@gmail.com` and `o'brien@example.ie` were rejected the same way.
   Not in Ray's ticket, but it's the same bug for a different group of users.

## Fix

- Domain ending is now `\.\w{2,}` (2 or more characters).
- The name part now also allows `+` and `'`.
- Still rejects addresses with no `@`, no domain ending, a 1-letter ending,
  two `@` signs, spaces inside, or double dots.
- Also removed a stray `123;` line in `Login.tsx` that did nothing.

## Automated tests

Run with `yarn test`. 39 tests.

- `src/utils/index.test.ts`: Luigi and John, all 10 seeded users, 9 other real
  address shapes, 11 invalid addresses, and `sanitizeEmail`.
- `src/pages/Login.test.tsx`: the actual login screen with the API, cache and
  navigation mocked. Luigi and John reach the map, the email is trimmed and
  lowercased before it's sent, a malformed email shows "invalid email", a short
  password shows "invalid password", and a rejected password stays on login.

Against the original regex, 16 of the 39 tests fail (Luigi, John, `.co`, `.ca`,
`.info`, `.museum`, `+`, apostrophe, and the login screen tests that depend on
them). With the fix, all 39 pass.

## Results (after the fix, on the phone)

| # | Result |
|---|---|
| 1 | Pass |
| 2 | Pass |
| 3 | Pass |
| 4 | Pass |
| 5 | Pass |
| 6 | Pass |
| 7 | Pass |
| 8 | Pass, pop-up titled "Authentication Error", server rejected the password |

## Findings and potential problems

- **Tester trap: the app stays logged in.** On my first run of 7 and 8 I
  hadn't logged out, so reopening the app went straight to the map and it
  looked like wrong passwords were accepted. The server log showed no rejected
  attempts at all. Logging out first fixed it. Worth knowing for anyone
  retesting.
- **Email validation is still only a format check.** A regex can't tell whether
  an address really exists. The server is the real check, and it rejects
  unknown users.
- **Very unusual but valid addresses would still fail**, like quoted names or
  addresses with non-English characters. Those are rare enough that I left them.
- **Login button is always tappable.** The task diagram shows it faded until
  both fields are filled in. It isn't part of this bug, so I didn't change it.
- **No icons in the input boxes.** The diagram has an envelope and a padlock.
  Also out of scope for this ticket.
- **Map footer says "event(s) found"**, the design says "events found". Also
  out of scope here.
