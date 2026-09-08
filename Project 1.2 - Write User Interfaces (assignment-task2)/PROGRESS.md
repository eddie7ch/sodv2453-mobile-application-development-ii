# Project 1.2 progress notes

Implemented (2026-09-08), done autonomously while Eddie is away — flagging
anything worth a second look rather than blocking on it.

## What was built

- `src/services/api.ts`: added `getEvents()` and `getEventDetails()`, both
  authenticated with the cached access token (same pattern as the existing
  `authenticateUser`).
- `src/types/Event.ts`: new type matching `db.json`'s event shape.
- `src/pages/EventsMap.tsx`: replaced the hardcoded 4-event array with a
  real fetch from the API on focus. Filters out past events
  (`dateTime < now`) per the assessment's requirement ("Past events should
  not be displayed in the map" — that's literally the description text on
  the one sample event meant to test this). Map re-fits to coordinates
  whenever the event list changes (not just on initial layout). Marker
  image now varies by event state: grey = full (volunteers already met),
  blue = the logged-in user's own event, default = open event by someone
  else. Footer count now reflects the real filtered list instead of a
  hardcoded "X".
- `src/pages/EventDetails.tsx`: new screen. Shows image, name, formatted
  date/time, description, and remaining volunteer slots. Re-fetches the
  full event by id on mount (same pattern EventsMap uses) so it's not
  stuck with possibly-stale data passed via navigation params.
- `src/routes/AppStack.tsx`: registered the new `EventDetails` screen.
- Marker press now navigates to `EventDetails` with the event as a param
  (event handler → passed down to `Marker`'s `onPress`, exactly what the
  rubric's "Implement interactivities" criterion asks for).

## Deliberately deferred to Project 1.3 (Manage Data Flows)

`EventDetails` has an "I want to volunteer" button, but it's a stub
(shows an alert) rather than a real submission — actually collecting a
volunteer application via a form and sending it to the API is Project
1.3's "Collect data" rubric criterion, not this project's. Building it
now would be jumping ahead into graded work that isn't this project's.

## Verification status

- `npx tsc --noEmit` passes clean, no type errors.
- Dependencies install cleanly with `yarn install` (peer-dep warnings only,
  expected for this Expo SDK version).
- **Not verified on an actual device/emulator or in Expo Go** — this
  environment has no Android/iOS emulator or physical device attached, and
  `expo start --web` needs `@expo/webpack-config` which isn't in this
  scaffold's dependencies (react-native-maps likely wouldn't render on web
  without extra shimming anyway, since it needs `PROVIDER_GOOGLE`). If you
  want to actually see it running, install Expo Go on your phone and run
  `yarn start` from this folder, then scan the QR code.
- No `json-server` was running during this work, so the actual network
  calls were never exercised end-to-end — reviewed by reading the code
  path carefully instead. Worth an actual run-through before submitting.
