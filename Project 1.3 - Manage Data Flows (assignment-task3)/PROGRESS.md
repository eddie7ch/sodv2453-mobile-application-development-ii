# Notes on Project 1.3

Pulled Project 1.2's work into this repo first (EventsMap, EventDetails,
the Event type) since the app keeps building on itself project to
project.

The two rubric criteria here are consume data and collect data, so:

Consume data: `loadEvents` now goes through `getFromNetworkFirst`, which
was already sitting unused in caching.ts. Fetches from the API, saves to
cache, falls back to cache if the request fails.

Collect data: built the CreateEvent screen. Name/description/volunteer
count/date-time as normal form fields, then "Use current location" reads
the GPS position via expo-location after asking permission, and there's
an optional photo picker that uploads through the existing imageApi
service before the event gets posted. Wired the "+" button on the map to
open it.

Left the volunteer-application stub from 1.2 alone since that's not what
either criterion here is asking for.

Type-checks clean, installs fine. Same story as 1.2 though, no phone or
emulator to actually run this on, and no json-server running to hit the
real endpoints, so the location/photo permission prompts specifically
haven't been tested for real. Worth doing before this gets submitted.
