# Notes on Project 1.2

Swapped the hardcoded 4-event array in EventsMap for a real fetch from
the API. Added `getEvents()` and `getEventDetails()` to api.ts, same auth
pattern as the existing login call.

Past events get filtered out (dateTime < now). One of the sample events
even has "Past events should not be displayed in the map" as its literal
description, which is a decent hint that's what they wanted tested.

Markers now change color based on state: grey if the event's full, blue
if it's mine, otherwise the default orange. Footer count is real now
instead of the old placeholder "X event(s) found".

Built the EventDetails screen: image, name, date/time, description,
remaining volunteer slots. It re-fetches the event by id on mount instead
of trusting whatever got passed through navigation, in case the data's
gone stale. Tapping a marker navigates there now.

Left the "I want to volunteer" button as a stub (just pops an alert) since
actually wiring that up to the API is Project 1.3's job, not this one's.

Type-checks clean, dependencies install fine.

Update: actually ran this on a real phone through Expo Go. Had to upgrade
the whole project from Expo SDK 47 to 57 first since the current Expo Go
app no longer supports SDK 47, and had to fix the json-server startup
command (needed the json-server-auth middleware flag for /login to work
at all, plain json-server 404s on it). After that, login, event fetching,
and the past-event filter all work end to end against the real API.

The map itself rendered black at first, no tiles, even though the
"Google" attribution showed up. Dropped the explicit PROVIDER_GOOGLE prop,
but that alone didn't fix it, since Expo Go bakes in its own shared Maps
key at build time and ignores whatever key the app's own config
specifies anyway. Root cause was a version mismatch between
react-native-maps 1.27 (needed for SDK 57) and whatever Google Maps
native module is actually compiled into the Expo Go client binary.

Fixed properly by building a custom EAS dev client instead of using
plain Expo Go, and wiring in a real Google Maps API key (restricted to
the Maps SDK for Android, via an existing Google Cloud project that
already had billing set up). Rebuilt and reinstalled the dev client, and
now everything works end to end on the actual phone: login, the 3 event
markers show up on the map with the right colors (grey for full events,
orange for open ones that aren't mine), and tapping a marker opens Event
Details with the correct image, date, description, and volunteer count.
