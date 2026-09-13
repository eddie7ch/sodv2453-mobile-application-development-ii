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

- **Login:** email/password auth against a fake API, with a cached
  session so returning users skip straight past the login form.
- **Events map:** fetches and displays upcoming events, colored by state
  (open / full / your own event).
- **Event details:** full info for a single event.
- **Create event:** a form that also reads the device's GPS location and
  optionally attaches a photo, then publishes the event.

## Requirements

- [Node.js](https://nodejs.org/) 20 or newer, and Yarn
- An Android phone on the same Wi-Fi as your computer, with the Volunteam
  development build installed (Expo Go can't show the map for this setup)
- A free [Cloudinary](https://cloudinary.com/) account if you want event photo
  uploads to work

## Setting up the development environment

1. Install dependencies:
   ```
   yarn install
   ```
2. Set up the fake API, see below.
3. (Optional) Set up event photos, see "Event photos (Cloudinary)".

### Fake API (`json-server`)

The app talks to `db.json` through `json-server` (with `json-server-auth` for
login) instead of a real backend.

Get your computer's local IP address, then start the server:

```
npx json-server --watch db.json --port 3333 --host <your_ip_address> -m ./node_modules/json-server-auth
```

Set `baseURL` in `src/services/api.ts` to `http://<your_ip_address>:3333`. It
has to be your computer's real IP, not `localhost`, so the phone can reach it.

Every seeded user's password is `123456`, for example `ulla.ulriksen@example.com`.

## Running the app

```
npx expo start --dev-client
```

Open the Volunteam development build on your phone and pick your computer from
the list of development servers.

## Running the tests

```
yarn test
```

Runs the Jest unit tests for `validateEmail` in `src/utils/index.ts`.

## Event photos (Cloudinary)

Photos are uploaded to Cloudinary. Copy `.env.example` to `.env` and fill in
your cloud name and an unsigned upload preset. For release builds, add the same
two values as repository variables (Settings, Secrets and variables, Actions,
Variables tab).

## Releasing a new version

Publishing a release on GitHub builds the app automatically
(`.github/workflows/release.yml` at the root of this repo).

1. Update `version` in `app.config.ts` and merge the change to `master`.
2. On GitHub, open **Releases** and click **Draft a new release**.
3. Create a tag like `v1.2.0`, give it a title, and describe the new
   features and bug fixes.
4. Click **Publish release**.

The workflow then:

1. Runs the unit tests and the type check. If anything fails, nothing gets built.
2. Builds Android and iOS at the same time:
   - `volunteam-android.apk`, installable straight onto an Android phone (arm64, which every current phone uses).
   - `volunteam-android.aab`, the format Google Play wants.
   - `volunteam-ios-simulator.zip`, an unsigned Release build for the iOS
     Simulator. Signing it for the App Store needs the Apple Developer
     account the deployment team owns.
3. Attaches all three files to the release, under **Assets**.

It takes about 15 minutes. Follow it in the **Actions** tab. To try a build
without publishing a release, use **Run workflow** on the same page. The files
then show up under the run's **Artifacts** instead.

For the map to work in the Android build, add a repository secret named
`GOOGLE_MAPS_API_KEY_ANDROID` (Settings, Secrets and variables, Actions).
