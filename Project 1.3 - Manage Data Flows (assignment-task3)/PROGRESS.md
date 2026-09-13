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

Originally left the volunteer button as the stub from 1.2, but the stub's
own alert literally said "will be implemented in Project 1.3", so I went
back and built it (see below).

Also bumped this project from Expo SDK 47 to SDK 57, same as 1.2, since
Expo Go stopped loading SDK 47 projects entirely. Ran the SDK 57 install,
then expo install --fix to bring react, react-native, and all the expo-*
packages up to matching versions. Had to add expo-splash-screen,
@react-native-community/datetimepicker, and expo-status-bar to the plugins
array by hand since app.config.ts is a dynamic config and expo can't write
to it automatically. expo-doctor flagged three things: @types/react-native
installed directly (removed it, types ship with react-native now),
react-native-reanimated needing react-native-worklets as a peer dep
(installed it), and @types/react, @types/react-dom, typescript being
behind what SDK 57 wants (bumped those too). All 21 checks pass now.

tsc needed a few fixes after that. Dropped the moduleResolution: node
override in tsconfig.json so it inherits bundler mode from expo's base
config. Moved the old top-level splash config in app.config.ts into the
expo-splash-screen plugin instead, since ExpoConfig doesn't allow a
splash key anymore. Removed translucent off the two StatusBar uses
(App.tsx and Login.tsx), it's not a valid prop anymore. Swapped
StyleSheet.absoluteFillObject for absoluteFill in EventsMap.tsx. And
installed @expo/vector-icons directly since a few screens import from it
but expo install --fix didn't pull it in on its own. tsc --noEmit is
clean now, and expo export --platform android bundles fine too.

## Testing it on an actual phone

Ran the whole thing on my Pixel through the custom dev client I'd already
built for 1.2 (same native modules, so it can load this project's code
too). That turned up a bunch of stuff type-checking never would have.

The seeded events were all dated 2022/2023, so the map filtered every one
of them out as past events. Bumped three of them to Oct/Nov 2026 and left
the "!!!Past Event!!!" one alone, since that's the one that proves the
filter works.

Creating an event failed with a vague "something went wrong". Took a
while to track down: the photo upload runs first, and ImgBB (what the
starter used) was rejecting it, which killed the whole create. Two fixes
there. A failed photo upload no longer blocks the event, it saves without
the image and tells you. And ImgBB turned out to be blocking my brand new
account outright ("You have been forbidden to use this website", error
103), even when uploading straight through their own website. So I
switched photo hosting to Cloudinary with an unsigned upload preset. No
secret key in the app that way. Settings go in `.env`, see
`.env.example`. The upload also sends the base64 the image picker already
gives you, instead of re-reading the file through fetch and FileReader.

Picking a date crashed on Android ("Cannot read property 'dismiss' of
undefined"). Android doesn't have a combined date and time picker, so
mode="datetime" just breaks there. Now it opens the date picker, then the
time picker right after.

After a few photos the image picker started crashing with an
OutOfMemoryError. Full size base64 images were piling up in memory. Turned
the quality down, clear the old image when picking a new one and after
saving, and the picker shows a normal message now instead of an uncaught
promise.

Built the "I want to volunteer" button. It adds your user id to the
event's volunteersIds with a PATCH, then the screen shows you're
volunteering and disables the button. It also stays disabled when the
event is full.

Everything checked on the phone: login, map and markers, network-first
event loading, creating an event with GPS location and a photo, the new
event showing up with its photo, and signing up to volunteer (confirmed
the id actually saved in db.json, not just on screen). Cleaned the test
events back out of db.json afterward.

## Second pass: matching the brief and the Figma design

Once I had the full brief and the task diagram, my Create Event screen was
missing a lot, so I rebuilt it.

- Creating an event is now two screens like the design. First a map with
  the "Add event" header: it moves to my GPS location, I tap where the event
  is, and Next shows up once there's a pin. Then the form.
- The form has Event Name, About (300 characters max), Volunteers Needed,
  Date and Time, and Picture. Every field is required, and Save stays
  disabled until they're all filled in, the date is in the future, and the
  picture has uploaded.
- Picture asks for camera or library, checks the right permission, and
  uploads straight away. Once it's online the box shows the thumbnail,
  file name and size, with an X to remove it.
- After Save it goes back to the map, which fetches the events again and
  zooms to fit them, new one included. The footer says "4 events found"
  instead of "event(s)".
- Pulled the header into its own `Header` component and the picture box into
  `PictureField`, so both screens reuse them. Also fixed `BigButton` so a
  disabled button actually can't be tapped.

Tested the whole flow on my phone: empty form with Save disabled, taking a
photo, choosing one from the library, removing it, then saving and seeing
the new pin on the map.

## Data flows, and what I'd improve

Loading events: the map asks the API first. If that works the response is
saved to AsyncStorage, and if the request fails (no network, server down)
it falls back to whatever was saved last time. Then past events get filtered
out and the map zooms to fit what's left.

Improvements I'd recommend:

- The cache has no age on it. If the app is offline for a week it would show
  week-old events without saying so. Saving a timestamp with the data would
  let the map show "last updated" or refuse very old data.
- Filtering past events happens on the phone after downloading everything.
  Once there's a real backend, asking it for future events only would save
  data as the list grows.
- Creating an event doesn't work offline at all. A small queue that saves the
  event locally and sends it once the network is back would stop people
  losing a filled-in form.

Creating events: the photo uploads the moment it's picked, and the event
itself is only saved when Save is pressed. That keeps Save instant, but it
means if someone uploads a photo and then closes the form, the image stays on
Cloudinary with no event pointing to it. Uploading on save, or cleaning up
unused images, would fix that. The upload also sends the photo as base64 text,
which is about a third bigger than the file itself, so uploading the file
directly would be faster on mobile data.

## What I learned

A generic error message hides the real problem. "Could not create the
event" turned out to be the photo upload failing, not the event itself.
Showing the actual error on screen for a minute found it quickly. I also
learned to check the server log: the POST never showed up there, which
meant the request wasn't even reaching my API.

One optional step shouldn't break the main action. If the photo fails, the
event should still save. I changed the code so they're handled separately.

Third-party services can fail for reasons you can't fix. ImgBB blocked my
new account outright, so I switched to Cloudinary. Keeping the upload code
in one small file (imageApi.ts) made that swap easy.

Platforms behave differently. The date picker worked in theory but crashed
on Android, because Android has no combined date and time picker. Things
like this only show up when you test on the platform itself.

Memory matters on a phone. Holding full-size base64 photos made the image
picker crash after a few tries. Lowering the quality and clearing old
images fixed it.

Design files and diagrams are part of the requirements, not just a style
guide. My first version covered the rubric, but the diagram showed a two-step
flow, required fields and a disabled Save button that the rubric never
spelled out.
