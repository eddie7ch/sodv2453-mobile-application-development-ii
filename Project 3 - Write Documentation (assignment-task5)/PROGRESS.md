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
