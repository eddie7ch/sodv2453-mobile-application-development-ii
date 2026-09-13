# Volunteam

## Project scope and goal

Volunteam is a mobile app (React Native + Expo) that connects volunteers
with local events that need help. A logged-in user sees a map of upcoming
events near them, can tap one to see its details (description, date/time,
how many volunteers are still needed), and can organize their own event,
collecting a name, description, date/time, GPS location, and an optional
photo, then publishing it for others to find.

This repository is the SODV2453 (Mobile Application Development II)
assessment sequence: each numbered project folder in the course's monorepo
builds on the previous one's work. In this project's own folder specifically:

- **Login**: email/password auth against a fake API, with a cached
  session so returning users skip straight past the login form.
- **Events map**: fetches and displays upcoming events, colored by state
  (open, full, or your own event).
- **Event details**: full info for a single event.
- **Create event**: a form that also reads the device's GPS location and
  optionally attaches a photo, then publishes the event.

## Requirements

- [Node.js](https://nodejs.org/) 20 or newer, and Yarn. The app is on Expo
  SDK 57 (React Native 0.86), which won't run on Node 18.
- An Android or iOS phone on the same Wi-Fi as your computer, or an
  emulator.
- To see the map on a real device you need an Expo **development build**
  (see "Running on a phone" below). Plain Expo Go runs everything else, but
  it can't render the map tiles for this version of `react-native-maps`.
- A free [ImgBB](https://imgbb.com/signup) account if you want event photo
  uploads.

## Setting up the development environment

1. Install dependencies:
   ```
   yarn install
   ```
   This also runs `patch-package`, which applies a small fix to `jest-expo`
   (see "Running the tests").
2. Set up the fake API, see below.
3. (Optional) Set up image uploads, see below.

### Fake API (`json-server`)

The app talks to `db.json` through `json-server` instead of a real backend.
The `-m ./node_modules/json-server-auth` part matters: that's what adds the
`/login` endpoint. Without it, logging in fails with a 404.

Find your computer's local IP address (`ipconfig` on Windows, look for the
IPv4 address), then start the server:

```
npx json-server --watch db.json --port 3333 --host <your_ip_address> -m ./node_modules/json-server-auth
```

Set `baseURL` in `src/services/api.ts` to `http://<your_ip_address>:3333`.
It has to be your machine's real IP, not `localhost`, so a phone on the same
Wi-Fi can reach it.

Every seeded user's password is `123456` (for example
`ulla.ulriksen@example.com`).

The map only shows events whose date hasn't passed yet. If the seeded dates
in `db.json` are in the past, the map will say "0 event(s) found", so move
them into the future.

Alternative, no local server needed: point `baseURL` at
`https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>`
(requires `db.json` at the repo root). That one is read-only and doesn't
support login.

### Image upload API (ImgBB)

Photo uploads go through `src/services/imageApi.ts`, which uses
[ImgBB](https://api.imgbb.com/) by default.

1. Sign up at https://imgbb.com/signup and create an API key.
2. Put it in a `.env` file in this folder as `IMGBB_API_KEY=...`. The file
   is gitignored, so the key never gets committed.

Heads up: ImgBB sometimes blocks brand new accounts ("You have been
forbidden to use this website", error 103), even on their own website. If
that happens, swap the provider in `imageApi.ts`. Project 1.3 in this
monorepo shows a working Cloudinary version.

### Google Maps key (development build only)

A development build needs its own Google Maps key or the map crashes with
"API key not found".

1. In Google Cloud, enable **Maps SDK for Android** and create an API key
   restricted to that API.
2. Add it to EAS as an environment variable named
   `GOOGLE_MAPS_API_KEY_ANDROID` (`app.config.ts` reads it when building).

## Running the app

```
yarn start
```

This starts Metro and shows a QR code. Scan it with Expo Go to run the app
(everything except the map tiles works there).

### Running on a phone with the map (development build)

1. Build the development client once with EAS:
   ```
   npx eas-cli build --profile development --platform android
   ```
   Install the APK it gives you on your phone.
2. Start Metro in dev-client mode:
   ```
   npx expo start --dev-client
   ```
3. Open the installed app and pick your computer from the list of
   development servers.

You only rebuild when a native dependency changes. JavaScript changes just
need a reload in the app.

## Running the tests

```
yarn test
```

Runs the Jest unit tests (`jest-expo` preset), which cover `validateEmail`
in `src/utils/index.ts`.

The project folder name has parentheses in it, which breaks how `jest-expo`
finds native module mocks. `patches/jest-expo+57.0.5.patch` fixes that and
`jest.setup.js` stops Expo's `fetch` polyfill from crashing the run. Both
are applied automatically, so you shouldn't have to think about them.
