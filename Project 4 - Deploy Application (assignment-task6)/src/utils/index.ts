import Constants from 'expo-constants';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Platform } from 'react-native';
import { LatLng } from 'react-native-maps';

/**
 * Formats a byte count as a human-readable string (e.g. `1536` → `"1.5 KB"`).
 *
 * @param bytes - The size in bytes.
 * @param decimals - Number of decimal places to keep (default 2). Negative
 *   values are treated as 0.
 * @returns The formatted size, e.g. `"0 Bytes"`, `"4.2 MB"`.
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Formats a date's time-of-day in 12-hour clock form, e.g. `"2:05 pm"`.
 *
 * @param date - The date/time to format (only the hours/minutes are used).
 * @returns A string like `"12:00 am"` or `"9:30 pm"`.
 */
export const formatAMPM = (date: Date): string => {
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const newHours = hours % 12 ? hours : 12; // the hour '0' should be '12'
    const newMinutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = newHours + ':' + newMinutes + ' ' + ampm;
    return strTime;
};

/**
 * Returns a new `Date` a given number of hours after `dateTime`.
 *
 * @param dateTime - The starting date/time (not mutated).
 * @param hoursToAdd - Hours to add; can be negative to go backwards.
 */
export const addHours = (dateTime: Date, hoursToAdd: number) => {
    const milisecondsToAdd = hoursToAdd * 60 * 60 * 1000;
    const newDate = new Date(dateTime);
    return new Date(newDate.setTime(newDate.getTime() + milisecondsToAdd));
};

/**
 * Combines an existing date with a different time-of-day, e.g. to let a user
 * pick the date and time in two separate pickers and merge the results.
 *
 * @param existingDate - Supplies the year/month/day.
 * @param newTime - Supplies the hours/minutes (seconds/ms are zeroed).
 * @returns A new `Date` with `existingDate`'s day and `newTime`'s time.
 */
export const updateDateWithNewTime = (existingDate: Date, newTime: Date): Date => {
    const newDate = new Date(new Date(existingDate).setHours(newTime.getHours(), newTime.getMinutes(), 0, 0));
    return newDate;
};

/**
 * Normalizes an email address for comparison/submission: trims whitespace and
 * lowercases it (so e.g. `"Foo@Bar.com "` and `"foo@bar.com"` are treated the
 * same by the login form and the fake API).
 */
export const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

/**
 * Checks whether a string looks like a valid email address.
 *
 * Requires a `local-part@domain.tld` shape, where the TLD (and any earlier
 * dot-separated domain label) must be 2 or more word characters — so both
 * `user@example.com` and `user@example.it` are accepted, but `user@example`
 * (no TLD) or `not-an-email` are not.
 *
 * @param email - The raw input from the form field (untrimmed is fine).
 * @returns `false` immediately for an empty/falsy value, otherwise whether
 *   the sanitized address matches the pattern above.
 */
export const validateEmail = (email: string): boolean => {
    if (!email) return false;
    // Two bugs lived in this regex, both rejecting real addresses as "invalid email":
    // 1. The domain ending was `(\.\w{3})+`, so every part after the first dot had to be
    //    exactly 3 characters. That blocked 2-letter endings like luigi@carluccio.it and
    //    john@silva.com.br, and longer ones like .info. It's `\.\w{2,}` now.
    // 2. The part before the @ only allowed letters, digits, _, dots and dashes, so addresses with
    //    + or an apostrophe (bob+news@gmail.com, o'brien@example.ie) were rejected too.
    const regex = /^[\w+']+([.-][\w+']+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    return regex.test(sanitizeEmail(email));
};

/**
 * Converts one field of every object in an array from its raw JSON form
 * (typically an ISO date string) into a real `Date` instance, in place.
 *
 * @param array - The parsed JSON array (e.g. an API response body).
 * @param fieldName - The property name to convert on each element.
 * @returns The same array, mutated, for convenience chaining.
 */
export const parseDateFieldFromJSONResponse = (array: [], fieldName: string): any[] => {
    return array.map((x: any) => {
        x[fieldName] = new Date(x[fieldName]);
        return x;
    });
};

/** Converts a text-input string (e.g. "3") into a `number` (e.g. `3`). Returns
 * `NaN` if the text isn't numeric — callers should guard against that. */
export const castToNumber = (text: string) => {
    return Number(text);
};

/**
 * Reads a value out of the app's Expo config `extra` block (`app.config.ts`),
 * which is how build-time secrets like `IMGBB_API_KEY` reach the running app.
 *
 * @param variableName - The key under `extra` in the Expo config.
 * @returns The value if present; otherwise logs a warning and returns
 *   `undefined` (callers should handle a missing key gracefully).
 */
export const getEnvironentVariable = (variableName: string) => {
    try {
        const value = Constants.expoConfig?.extra?.[variableName];
        if (value != null) {
            return value;
        } else {
            throw new Error(`${variableName} not found.`);
        }
    } catch (e) {
        console.warn(e);
    }
};

/**
 * Builds a platform-appropriate deep link that opens the device's native maps
 * app at the given coordinates (Apple Maps on iOS, Google Maps/geo intent on
 * Android).
 *
 * @param coordinates - The `{ latitude, longitude }` to open.
 * @returns A `maps:` (iOS) or `geo:` (Android) URI.
 */
export const getMapsUrl = (coordinates: LatLng): string => {
    const { latitude, longitude } = coordinates;
    const latLng = `${latitude},${longitude}`;
    const label = 'Custom Label';
    return Platform.OS === 'ios' ? `maps:0,0?q=${label}@${latLng}` : `geo:0,0?q=${latLng}(${label})`;
};

/**
 * Checks whether a JWT access token is already expired, so the app can skip
 * straight to the Login screen instead of trying (and failing) an
 * authenticated request first.
 *
 * @param token - The raw JWT string, as returned by `authenticateUser` and
 *   read back from cache on app start.
 * @returns `true` if the token's `exp` claim is in the past.
 */
export const isTokenExpired = (token: string) => {
    const decodedToken = jwtDecode(token) as JwtPayload;
    const currentDate = Date.now();
    if ((decodedToken.exp as number) * 1000 < currentDate) {
        return true;
    } else {
        return false;
    }
};
