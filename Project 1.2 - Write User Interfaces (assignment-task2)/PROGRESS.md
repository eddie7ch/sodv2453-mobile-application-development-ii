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

## Second pass: matching the actual brief and the Figma design

The first version was built from the rubric alone, before I had the full
assignment text. Once I read the brief properly it was clear the Event
Details screen was missing most of what was asked for, so I went back.

What changed:

- The map now fits my current location as well as the events, every time
  the screen comes back into focus, not just the events on first load.
- The status box on Event Details has three states, worked out by one
  helper (`getEventStatus` in utils): "Volunteered" if I've applied,
  "X of Y" volunteers if the event is open, "Team is full" if it's full.
  The box itself is its own component, `EventStatusBox`.
- Call and Text only show once I've volunteered, and they open the dialer
  and messages with the organizer's real number (fetched from /users).
- Volunteer only shows when the event isn't full and I haven't applied,
  and it actually saves me as a volunteer now.
- Share shows for open events and ones I've volunteered for.
- Added the map preview and a "Get Directions to Event" button that opens
  the phone's maps app.

For the design I made a copy of the course Figma file into my drafts so I
could read the exact values off the three Event frames (open, volunteered,
full): colours, font sizes, box heights, spacing. The screen follows those
now instead of my guesses.

Tested all three states on my phone as Yasemin, whose account happens to
cover each one, and tried every button: Call, Text, Share, Volunteer and
Get Directions all work.

## Libraries I added and why

The brief allows third party libraries as long as I can justify them. I only
added what the SDK 57 upgrade or the screen actually needed:

- `@expo/vector-icons`: the icons on the buttons and status boxes (share,
  phone, calendar, check). It's Expo's own icon set and was already being
  imported by the starter, it just wasn't listed in package.json.
- `expo-splash-screen`: SDK 57 moved the splash screen config into this
  plugin, so the old `splash` setting stopped working without it.
- `react-native-worklets`: required by `react-native-reanimated` 4, which
  the SDK upgrade pulled in. Nothing in my code uses it directly.
- `expo-dev-client`: only for running the app on my phone with the Google
  map working. Expo Go couldn't render the map tiles on SDK 57.
- `@types/node` (dev only): type definitions so `app.config.ts` can read
  environment variables. Never ends up in the app.

On bundle size: the icons, splash screen and worklets are small and are
things the app needs anyway. `expo-dev-client` and `@types/node` aren't part
of the app a user would install from a store, so they don't add to it.
Call, Text, Share and Get Directions use React Native's built in `Linking`
and `Share` instead of extra packages.

## What I learned

Type-checking clean doesn't mean the app works. Everything compiled fine,
and it still wouldn't even open on my phone because the starter was on an
Expo SDK that Expo Go stopped supporting. Running it on a real device early
would have saved me a lot of back and forth.

A blank screen isn't always your code. The map was black with no error, and
it turned out Expo Go can't render Google Maps tiles for this version of
react-native-maps. The fix was a development build plus a real API key, not
anything in EventsMap.tsx. Next time I'll check whether a problem is the
environment before digging through my own components.

Read the setup instructions properly. I lost time on a login 404 because I
started json-server without the json-server-auth middleware, and the README
already had the right command.

Seed data goes stale. Every sample event was dated 2022 or 2023, so the map
filtered them all out and looked broken. The filter was doing its job.

Read the whole brief, not just the rubric. The rubric only listed general
skills like "manage state", so my first version technically hit those but
missed the actual screen the assignment described. Going back to the brief
and the Figma frames is what showed me what "done" really meant here.
