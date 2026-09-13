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

Type-checks clean, dependencies install fine. Haven't run this on an
actual phone or emulator though, and there's no json-server running
either, so the network calls have never actually fired, just read through
carefully. Should probably do a real run-through before this gets
submitted anywhere.
