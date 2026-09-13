import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Fetches fresh data over the network and caches it, falling back to
 * whatever is already cached if the network request fails (e.g. the device
 * is offline). This is the "consume data" pattern used by `EventsMap` to
 * load the events list: try the API first, but don't leave the user with a
 * blank screen just because the network hiccupped.
 *
 * @param key - The cache key to store/read the value under (also used as the
 *   `AsyncStorage` key — should be unique per kind of data, e.g. `"events"`).
 * @param request - An already-started request (e.g. `api.getEvents(token)`).
 * @returns The network response if it succeeded (and it's now cached); the
 *   cached value otherwise. Rejects if the network fails *and* there's
 *   nothing cached yet for `key`.
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
 * Saves a value to `AsyncStorage` under `key`, JSON-serialized.
 *
 * @param key - The storage key.
 * @param value - Any JSON-serializable value.
 */
export const setInCache = (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
};

/**
 * Reads and JSON-parses a value previously saved with {@link setInCache}.
 *
 * @param key - The storage key.
 * @returns The parsed value.
 * @throws (rejects) if there's nothing cached under `key`.
 */
export const getFromCache = async <T>(key: string): Promise<T> => {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
};
