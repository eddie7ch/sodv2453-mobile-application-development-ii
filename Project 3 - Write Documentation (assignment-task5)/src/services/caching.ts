import AsyncStorage from '@react-native-async-storage/async-storage';

// Saves data on the phone (AsyncStorage) so the app remembers things between launches,
// like the logged-in user, and can keep working when the network is down.

/**
 * Tries the network first and falls back to the phone's saved copy if the request fails.
 * A successful response is saved so it's available offline next time.
 *
 * @param key - Name the response is saved under, e.g. "events".
 * @param request - The network request to wait for.
 * @returns A promise with the fresh response, or the saved one if the request failed.
 * Rejects if the request failed and nothing was saved under `key` yet.
 */
export const getFromNetworkFirst = async <T>(key: string, request: Promise<T>): Promise<T> => {
    try {
        const response = await request;
        setInCache(key, response);
        return response;
    } catch (e) {
        return getFromCache<T>(key);
    }
};

/**
 * Saves a value on the phone under a key, replacing anything already saved there.
 *
 * @param key - Name to save the value under, e.g. "accessToken".
 * @param value - Any value that can be turned into JSON.
 * @returns A promise that resolves once the value is saved.
 */
export const setInCache = (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
};

/**
 * Reads a value saved with {@link setInCache}.
 *
 * @param key - Name the value was saved under.
 * @returns A promise with the saved value. Rejects with a message if nothing is saved under `key`.
 */
export const getFromCache = async <T>(key: string): Promise<T> => {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
};
