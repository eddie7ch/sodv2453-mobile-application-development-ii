import AsyncStorage from '@react-native-async-storage/async-storage';

// Tries the network first, caches whatever comes back, and falls back to
// the cache if the request fails (offline, timeout, whatever). This is
// what EventsMap uses to load events - if the fetch fails there's still
// a last-known list to show instead of a blank screen. Only rejects if
// the network fails and there's nothing cached yet either.
export const getFromNetworkFirst = async <T>(key: string, request: Promise<T>): Promise<T> => {
    try {
        const response = await request;
        setInCache(key, response);
        return response;
    } catch (e) {
        return getFromCache<T>(key);
    }
};

export const setInCache = (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
};

// rejects if nothing's stored under that key
export const getFromCache = async <T>(key: string): Promise<T> => {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
};
