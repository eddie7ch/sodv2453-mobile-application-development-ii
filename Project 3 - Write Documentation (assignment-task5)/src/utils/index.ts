import Constants from 'expo-constants';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Platform } from 'react-native';
import { LatLng } from 'react-native-maps';

// Small helper functions shared across the app: formatting, dates, email checks, maps and login tokens.

/**
 * Turns a number of bytes into a short, readable size.
 *
 * @param bytes - File size in bytes, e.g. 1536.
 * @param decimals - How many decimal places to keep. Defaults to 2.
 * @returns The size with a unit, e.g. "1.5 KB". Returns "0 Bytes" for 0 or a non-number.
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
 * Formats the time of a date in 12-hour style.
 *
 * @param date - The date to read the time from.
 * @returns The time as text, e.g. "9:05 am" or "12:30 pm".
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
 * Adds hours to a date without changing the original.
 *
 * @param dateTime - The starting date and time.
 * @param hoursToAdd - Number of hours to add. Can be negative or a fraction, e.g. 1.5.
 * @returns A new Date that many hours later.
 */
export const addHours = (dateTime: Date, hoursToAdd: number) => {
    const milisecondsToAdd = hoursToAdd * 60 * 60 * 1000;
    const newDate = new Date(dateTime);
    return new Date(newDate.setTime(newDate.getTime() + milisecondsToAdd));
};

/**
 * Keeps the day from one date and the time from another. Useful when a date picker and
 * a time picker are separate.
 *
 * @param existingDate - Date whose year, month and day are kept.
 * @param newTime - Date whose hours and minutes are used. Seconds are set to 0.
 * @returns A new Date combining the two.
 */
export const updateDateWithNewTime = (existingDate: Date, newTime: Date): Date => {
    const newDate = new Date(new Date(existingDate).setHours(newTime.getHours(), newTime.getMinutes(), 0, 0));
    return newDate;
};

/**
 * Cleans up an email address before it's checked or sent to the server.
 *
 * @param email - The address as the user typed it.
 * @returns The address with spaces removed from both ends and all letters lowercase.
 */
export const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

/**
 * Checks that an email address looks correctly formatted. It doesn't check that the
 * address really exists; the server does that when logging in.
 *
 * @param email - The address to check. It's cleaned with {@link sanitizeEmail} first.
 * @returns `true` if the format is valid, `false` if it's empty or badly formatted.
 */
export const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3})+$/;
    const sanitizedEmail = email.trim().toLowerCase();
    const result = sanitizedEmail.match(regex);
    return !!result?.[0];
};

/**
 * Converts a date field in a list of API results from text into real Date objects.
 * JSON has no date type, so dates arrive as strings.
 *
 * @param array - Items returned by the API. They're changed in place.
 * @param fieldName - Name of the field holding the date, e.g. "dateTime".
 * @returns The same items, with that field now a Date.
 */
export const parseDateFieldFromJSONResponse = (array: [], fieldName: string): any[] => {
    return array.map((x: any) => {
        x[fieldName] = new Date(x[fieldName]);
        return x;
    });
};

/**
 * Converts text from an input box into a number.
 *
 * @param text - Text such as "12".
 * @returns The number, or `NaN` if the text isn't a number.
 */
export const castToNumber = (text: string) => {
    return Number(text);
};

/**
 * Reads a setting from the `extra` section of the Expo config (app.config.ts), such as an API key.
 *
 * @param variableName - Name of the setting, e.g. "IMGBB_API_KEY".
 * @returns The setting's value, or `undefined` with a warning in the console if it isn't set.
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
 * Builds a link that opens a location in the phone's maps app
 * (Apple Maps on iOS, the default maps app on Android).
 *
 * @param coordinates - Latitude and longitude of the place.
 * @returns A `maps:` link on iOS or a `geo:` link on Android, ready for `Linking.openURL`.
 */
export const getMapsUrl = (coordinates: LatLng): string => {
    const { latitude, longitude } = coordinates;
    const latLng = `${latitude},${longitude}`;
    const label = 'Custom Label';
    return Platform.OS === 'ios' ? `maps:0,0?q=${label}@${latLng}` : `geo:0,0?q=${latLng}(${label})`;
};

/**
 * Checks whether a saved login token has run out, so the user must log in again.
 *
 * @param token - The access token (JWT) received when logging in.
 * @returns `true` if the token's expiry time has passed, otherwise `false`.
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
