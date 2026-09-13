/** A user of the app, as returned by the API when logging in. */
export interface User {
    /** The user's first and last name. */
    name: {
        first: string;
        last: string;
    };
    /** Email address used to log in. */
    email: string;
    /** Unique ID, used to link users to the events they organize or volunteer for. */
    id: string;
    /** Phone number, e.g. "(910) 862-3167". */
    mobile: string;
}
