# Volunteam

## What this project is

Volunteam is a mobile app that connects volunteers with local events that need
help, like a park clean-up or a food bank shift.

**Goal:** make it easy for people to find volunteering events near them and
sign up, and for organizers to post events and get the help they need.

**Scope of this version:** it's an early build with two working screens.

- **Login.** Volunteers log in with their email and password. The app checks
  the fields before sending them, shows clear error messages, and remembers
  the login so returning users go straight to the map.
- **Events map.** Shows events as pins on a map of Calgary, with a count of
  events at the bottom and a log out button at the top.

Not built yet: creating events (the "+" button), event details (tapping a
pin) and loading real events from the server. The map uses sample pins for
now.

It's built with React Native and Expo (SDK 57), written in TypeScript. There's
no real backend: a small fake API (`json-server`) serves the data in `db.json`.

## Project structure

| Folder | What's in it |
|---|---|
| `App.tsx` | Starting point. Loads fonts and the navigation. |
| `src/pages` | The screens: `Login` and `EventsMap`. |
| `src/components` | Reusable pieces: `BigButton` and `Spacer`. |
| `src/routes` | `AppStack`, the list of screens and who is logged in. |
| `src/context` | `AuthenticationContext`, shares the logged-in user with every screen. |
| `src/services` | Talking to the outside world: the fake API, image uploads, and saving data on the phone. |
| `src/utils` | Small helpers for dates, emails, maps and login tokens. |
| `src/constants` | Map starting position and padding. |
| `db.json` | The fake API's data: users and events. |

Every function, component and screen has a comment above it explaining what
it does, what it needs and what it gives back.

## Setting up the development environment

You only need to do this once.

### 1. Install the tools

- [Node.js](https://nodejs.org/) 20 or newer (Expo SDK 57 won't run on older versions).
- Yarn: `npm install --global yarn`
- An Android or iPhone on the same Wi-Fi as your computer, with the
  **Expo Go** app installed. An Android emulator or iOS simulator works too.

### 2. Get the code and install the packages

```
git clone <this repository's URL>
cd "<this project's folder>"
yarn install
```

### 3. Point the app at your computer

The phone needs to reach the fake API running on your computer, so it needs
your computer's local IP address, not `localhost`.

1. Find your IP address. On Windows run `ipconfig` and look for "IPv4
   Address" (something like `192.168.1.20`). On macOS run
   `ipconfig getifaddr en0`.
2. Open `src/services/api.ts` and set `baseURL` to
   `http://<your_ip_address>:3333`.

### 4. (Optional) Image uploads

Image uploads aren't used by any screen yet, but `src/services/imageApi.ts` is
ready for them. It uses [ImgBB](https://api.imgbb.com/):

1. Sign up for free at https://imgbb.com/signup and create an API key.
2. Create a file named `.env` in the project folder containing
   `IMGBB_API_KEY=<your key>`. The file is ignored by git, so your key is never
   committed.

For builds made with EAS, add the key there instead with `eas secret:push`.

## Running the application

You need two terminals open in the project folder.

**Terminal 1: start the fake API**

```
npx json-server --watch db.json --port 3333 --host <your_ip_address> -m ./node_modules/json-server-auth
```

Keep the `-m ./node_modules/json-server-auth` part. It adds the `/login`
address the app logs in with; without it every login fails.

**Terminal 2: start the app**

```
yarn start
```

A QR code appears. On Android, scan it with Expo Go. On iPhone, scan it with
the Camera app. The app opens on the login screen.

**Log in** with any user from `db.json`. Every user's password is `123456`,
for example `ulla.ulriksen@example.com`.

Known issue in this version: users whose email doesn't end in a
three-letter ending like `.com` (for example `luigi@carluccio.it`) get
"invalid email". This is fixed in a later project.

### Seeing the map on a real phone

Expo Go can run everything, but on some phones the map area stays blank
because the map needs its own Google Maps key. To see it:

1. In Google Cloud, enable **Maps SDK for Android** and create an API key.
2. Save it in EAS as an environment variable named `GOOGLE_MAPS_API_KEY_ANDROID`.
3. Build a development version of the app once and install it on the phone:
   ```
   npx eas-cli build --profile development --platform android
   ```
4. Start the app with `npx expo start --dev-client` and open it from the
   installed development app instead of Expo Go.

### Using an online fake API instead

If you don't want to run `json-server`, set `baseURL` to
`https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>`
(`db.json` must be at the root of that repo). It's read-only and doesn't
support logging in, so it's only useful for browsing data.

## Troubleshooting

- **"Network Error" or the spinner never stops when logging in:** the phone
  can't reach the fake API. Check it's running, `baseURL` has your current IP
  address, and both devices are on the same Wi-Fi.
- **The app skips the login screen:** you're still logged in. Tap the log out
  button on the map.
- **"Authentication Error":** the email isn't in `db.json` or the password is
  wrong.
