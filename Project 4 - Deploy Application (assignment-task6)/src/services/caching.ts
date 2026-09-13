import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFromNetworkFirst = async <T>(key: string, request: Promise<T>): Promise<T> => {
    try {
        const response = await request;
        // Only the body is saved. The full Axios response also holds the request object,
        // which isn't safe to turn into JSON.
        setInCache(key, { data: (response as any)?.data }).catch((error) => console.log(error));
        return response;
    } catch (e) {
        return getFromCache<T>(key);
    }
};

export const setInCache = (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
};

export const getFromCache = async <T>(key: string): Promise<T> => {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
};
