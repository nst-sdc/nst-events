import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type UserRole = 'admin' | 'participant' | null;

interface User {
    id: string;
    email: string;
    role: UserRole;
    approved: boolean;
    name?: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, role: UserRole, approved?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    login: async (email, role, approved = false) => {
        // Simulate API call
        set({ isLoading: true });
        try {
            const user = { id: '123', email, role, approved, name: 'Test User' };
            await SecureStore.setItemAsync('user_session', JSON.stringify(user));
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('Login failed', error);
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await SecureStore.deleteItemAsync('user_session');
            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            console.error('Logout failed', error);
            set({ isLoading: false });
        }
    },

    restoreSession: async () => {
        set({ isLoading: true });
        try {
            const session = await SecureStore.getItemAsync('user_session');
            if (session) {
                const user = JSON.parse(session);
                set({ user, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Session restore failed', error);
            set({ isLoading: false });
        }
    },
}));
