import axios, { AxiosResponse } from 'axios';

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

    baseURL: 'http://0.0.0.0:3333',
});

/**
 * Logs a user in against the fake API's `/login` route (provided by
 * `json-server-auth`).
 *
 * @param email - The user's email address (should already be sanitized/lowercased
 *   by the caller — see `sanitizeEmail`).
 * @param password - The user's plaintext password; the server compares it against
 *   the bcrypt hash stored in `db.json`.
 * @returns The Axios response. On success, `response.data` is
 *   `{ accessToken: string; user: User }`.
 */
export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
    return api.post(`/login`, { email, password });
};

/**
 * Fetches every event from the API (no filtering server-side — callers are
 * responsible for e.g. excluding past events).
 *
 * @param accessToken - The bearer token returned by `authenticateUser`, required
 *   because `/events` is a protected route under `json-server-auth`.
 * @returns The Axios response; `response.data` is an array of `Event` objects.
 */
export const getEvents = (accessToken: string): Promise<AxiosResponse> => {
    return api.get(`/events`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};

/**
 * Fetches a single event by id — used to refresh an event's details with the
 * latest server data (e.g. after another user has volunteered).
 *
 * @param eventId - The event's `id` field.
 * @param accessToken - The bearer token returned by `authenticateUser`.
 * @returns The Axios response; `response.data` is a single `Event` object.
 */
export const getEventDetails = (eventId: string, accessToken: string): Promise<AxiosResponse> => {
    return api.get(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};

/** The event fields a client provides when creating a new event — everything
 * except `id` (server-assigned) and `volunteersIds` (starts empty). */
export interface NewEventData {
    name: string;
    description: string;
    dateTime: string;
    position: { latitude: number; longitude: number };
    volunteersNeeded: number;
    organizerId: string;
    imageUrl?: string;
}

/**
 * Creates a new event on the server.
 *
 * @param event - The event's data, collected from the Create Event form plus
 *   the device's GPS location. `volunteersIds` is always sent empty — a brand
 *   new event has no volunteers yet.
 * @param accessToken - The bearer token returned by `authenticateUser`.
 * @returns The Axios response; `response.data` is the created `Event`
 *   (including the server-assigned `id`).
 */
export const createEvent = (event: NewEventData, accessToken: string): Promise<AxiosResponse> => {
    return api.post(`/events`, { ...event, volunteersIds: [] }, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};
