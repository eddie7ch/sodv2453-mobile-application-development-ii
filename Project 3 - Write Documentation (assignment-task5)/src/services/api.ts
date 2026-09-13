import axios, { AxiosResponse } from 'axios';

/** HTTP client for the app's fake API (json-server). Every request goes to `baseURL`. */
const api = axios.create({
    // Before running your 'json-server', get your computer's IP address and
    // update your baseURL to `http://your_ip_address_here:3333` and then run:
    // `npx json-server --watch db.json --port 3333 --host your_ip_address_here`
    //
    // To access your server online without running json-server locally,
    // you can set your baseURL to:
    // `https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>`
    //
    // To use `my-json-server`, make sure your `db.json` is located at the repo root.

    baseURL: 'http://192.168.1.156:3333',
});

/**
 * Logs a user in against the fake API.
 *
 * @param email - The user's email address, already trimmed and lowercased.
 * @param password - The user's password.
 * @returns A promise with the server response. On success `response.data` has `user`
 * (the user's details) and `accessToken` (a JWT). Rejects with a 400 error, whose
 * `response.data` explains why, if the email isn't registered or the password is wrong.
 */
export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
    return api.post(`/login`, { email, password });
};
