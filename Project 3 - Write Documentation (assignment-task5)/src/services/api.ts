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

// hits json-server-auth's /login route. On success response.data is
// { accessToken, user }.
export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
    return api.post(`/login`, { email, password });
};

// returns every event, unfiltered - it's on the caller to drop past ones etc.
// needs a token since /events is a protected route.
export const getEvents = (accessToken: string): Promise<AxiosResponse> => {
    return api.get(`/events`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};

// re-fetches one event by id, mainly so EventDetails isn't stuck showing
// whatever was passed through navigation if it's gone stale
export const getEventDetails = (eventId: string, accessToken: string): Promise<AxiosResponse> => {
    return api.get(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};

// everything the CreateEvent form + GPS location collect, minus id
// (server-assigned) and volunteersIds (starts empty on a new event)
export interface NewEventData {
    name: string;
    description: string;
    dateTime: string;
    position: { latitude: number; longitude: number };
    volunteersNeeded: number;
    organizerId: string;
    imageUrl?: string;
}

export const createEvent = (event: NewEventData, accessToken: string): Promise<AxiosResponse> => {
    return api.post(`/events`, { ...event, volunteersIds: [] }, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};
