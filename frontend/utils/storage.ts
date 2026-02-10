import * as SecureStore from 'expo-secure-store';
import { IS_WEB } from './platform';

const setItemAsync = async (key: string, value: string): Promise<void> => {
    if (IS_WEB) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Local storage unavailable:', e);
        }
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

const getItemAsync = async (key: string): Promise<string | null> => {
    if (IS_WEB) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Local storage unavailable:', e);
            return null;
        }
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

const deleteItemAsync = async (key: string): Promise<void> => {
    if (IS_WEB) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Local storage unavailable:', e);
        }
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

export const storage = {
    setItem: setItemAsync,
    getItem: getItemAsync,
    removeItem: deleteItemAsync,
};
