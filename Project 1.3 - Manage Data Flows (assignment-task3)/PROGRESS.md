# Project 1.3 progress notes

Implemented (2026-09-08), done autonomously while Eddie is away — flagging
anything worth a second look rather than blocking on it.

## What was built

- Carried forward Project 1.2's completed work into this repo first
  (`EventsMap.tsx`, `EventDetails.tsx`, `Event.ts`, the `EventDetails` route)
  since this app builds incrementally project-to-project.
- `src/services/api.ts`: added `getEvents`, `getEventDetails` (same as 1.2)
  plus `createEvent` — POSTs a new event to `/events`.
- `src/pages/EventsMap.tsx`: `loadEvents` now goes through
  `getFromNetworkFirst` (already-existing utility in `caching.ts`, unused
  until now) instead of a plain fetch — satisfies the **"Consume data"**
  rubric criterion directly (fetch from internet → save in cache → fall
  back to cache on failure). Also wired the "+" button to navigate to the
  new `CreateEvent` screen.
- `src/pages/CreateEvent.tsx`: new screen — satisfies the **"Collect
  data"** rubric criterion:
  - Form fields: name, description, volunteers needed, date/time (via
    `@react-native-community/datetimepicker`, already a dependency).
  - **Sensor**: "Use current location" button calls
    `expo-location`'s `getCurrentPositionAsync` (after requesting
    permission) to set the event's map position — this is the literal
    "read the sensor (e.g. GPS...)" performance criterion.
  - Optional image: `expo-image-picker` to pick a photo, uploaded via the
    existing `imageApi.uploadImage` service before the event is created.
  - On submit: posts the collected data to `/events` — "send data to
    internet".
- Registered `CreateEvent` in `AppStack.tsx`.

## Scope note

Did not touch the "apply to volunteer" flow (still a stub from Project
1.2) — that's not what either of this project's rubric criteria
(Consume data / Collect data) ask for; the create-event workflow is.

## Verification status

- `npx tsc --noEmit` passes clean, no type errors.
- `yarn install` succeeds (same peer-dep warnings as 1.2, expected).
- **Not verified on an actual device/emulator** — same limitation as
  Project 1.2 (no Android/iOS emulator or physical device in this
  environment, and no `json-server` was running to exercise the network
  calls end-to-end). Reviewed by reading the code path carefully instead.
  Location and image-picker permission prompts in particular can only be
  verified on a real device/emulator — worth an actual run-through before
  submitting.
