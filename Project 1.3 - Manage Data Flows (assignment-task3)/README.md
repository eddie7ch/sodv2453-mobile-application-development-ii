# Volunteam App

## Setting up the fake API (json-server)

Update the file `src/services/api.ts`.

Before running your 'json-server', get your computer's IP address and update your baseURL to `http://your_ip_address_here:3333` and then run:

```
npx json-server --watch db.json --port 3333 --host your_ip_address_here -m ./node_modules/json-server-auth
```

To access your server online without running json-server locally, you can set your baseURL to:

```
https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>
```

To use `my-json-server`, make sure your `db.json` is located at the repo root.

## Setting up the image upload API

Event photos are uploaded to [Cloudinary](https://cloudinary.com/) from
`src/services/imageApi.ts`. (The starter used ImgBB, but it blocked new
accounts, so this project switched.)

1. Create a free Cloudinary account.
2. Under Settings > Upload, add an upload preset with Signing mode set to
   **Unsigned**.
3. Copy `.env.example` to `.env` and fill in your cloud name and preset name:

```
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

`.env` is gitignored. An unsigned preset means no secret key is needed in the
app. Restart `npx expo start` after changing `.env`.
