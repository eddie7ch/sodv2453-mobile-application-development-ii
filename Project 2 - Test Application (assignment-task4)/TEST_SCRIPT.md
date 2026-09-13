# Test script: "Invalid email" login bug

## Bug report

QA (Ray) moved a ticket from "In Progress" to "Failed": some users can't
log into the app because entering their email address returns "invalid
email", even though the address is real. Not everyone is affected,
specifically **Luigi** and **John** (two of the seeded users in `db.json`).

## Manual reproduction steps

1. Start the app (`yarn start`) with `json-server` running against `db.json`.
2. On the Login screen, enter `luigi@carluccio.it` in the Email field and
   any password, then tap out of the field (`onEndEditing` fires the
   validation).
3. **Observed:** the field is marked invalid and shows "invalid email"
   under the label, even though this is a real, correctly-formatted
   address.
4. **Expected:** the email field should be accepted as valid so the login
   request can proceed to the server (which will then say whether the
   password is right).
5. Repeat with `john@silva.com.br`. Same incorrect "invalid email" result.
6. Repeat with `ulla.ulriksen@example.com` (a `.com` address). This one
   is (incorrectly, from the user's point of view, but this is the
   control case) accepted, which is what narrows the bug down to specific
   TLDs rather than the login flow in general.

## Root cause

`validateEmail` in `src/utils/index.ts` used the regex:

```
/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3})+$/
```

The final group, `(\.\w{3})+`, requires every dot-separated label after
the domain root to be **exactly 3 characters**. Both affected addresses
end in a label shorter than that:

- `luigi@carluccio.it` → TLD `it` is 2 characters.
- `john@silva.com.br` → the *last* label `br` is 2 characters (even though
  `com` earlier in the chain is 3, the whole tail has to match, not just
  one label).

Any real-world 2-letter country-code TLD (`.it`, `.br`, `.ca`, `.uk`,
`.de`, ...) was silently rejected. The 7 other seeded users all happen to
use `.com` addresses, which is why this wasn't caught earlier. The sample
data has enough variety to expose it (see the workplace-scenario video),
but a smaller/less varied dataset would have hidden it.

## Fix

Widened the TLD group from `\.\w{3}` (exactly 3) to `\.\w{2,}` (2 or
more): `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/`

## Automated regression test

`src/utils/index.test.ts`, `validateEmail` describe block. Covers:
- Both previously-broken addresses now pass (Luigi, John).
- A standard `.com` address still passes (no regression).
- Garbage input (no domain, no `@`, empty string) still correctly fails,
  confirms the fix widened validation without disabling it.

Run with `yarn test`. All 6 assertions pass after the fix (2 of them fail
against the pre-fix code, verified before applying the fix, per the
assessment's instructions to reproduce first).

## Manual test: re-run after the fix

Repeated steps 1-5 above against the fixed code: both `luigi@carluccio.it`
and `john@silva.com.br` are now accepted by the Email field, and the login
request reaches the server (which then correctly validates the password
against `db.json`, unrelated to this bug).
