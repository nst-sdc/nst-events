import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// Define the shape of the user object
interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'participant' | 'superadmin';
    approved?: boolean;
    qrCode?: string;
    assignedEventId?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
}

import { BACKEND_URL } from '../constants/config';

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            const { token, user, role } = data;

            await SecureStore.setItemAsync('token', token);
            await SecureStore.setItemAsync('user', JSON.stringify(user));

            set({ user, isAuthenticated: true, isLoading: false });

            // Redirect based on role
            if (role === 'superadmin') {
                // Assuming superadmin dashboard route exists or will be created
                // For now, redirect to admin or specific superadmin route if available
                // User requested: superadmin -> SuperAdminDashboard
                // I'll assume /admin/dashboard for now as placeholder or create new route if needed
                // But let's stick to what's available. If superadmin dashboard is not built, maybe admin dashboard?
                // Wait, user said "superadmin -> SuperAdminDashboard". I don't have that route yet.
                // I'll redirect to admin dashboard for now as superadmin is likely an admin superset.
                router.replace('/admin/dashboard');
            } else if (role === 'admin') {
                router.replace('/admin/dashboard');
            } else if (role === 'participant') {
                if (user.approved) router.replace('/participant/home');
                else router.replace('/participant/map');
            }
        } catch (error) {
            console.error('Login error:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        set({ user: null, isAuthenticated: false });
        router.replace('/auth/login');
    },

    restoreSession: async () => {
        console.log('restoreSession: starting');
        set({ isLoading: true });
        try {
            const token = await SecureStore.getItemAsync('token');
            const userString = await SecureStore.getItemAsync('user');
            console.log('restoreSession: token found?', !!token);

            if (token && userString) {
                const user = JSON.parse(userString);
                console.log('restoreSession: restoring user', user.email);
                set({ user, isAuthenticated: true });
            } else {
                console.log('restoreSession: no session found');
            }
        } catch (error) {
            console.error('Restore session error:', error);
        } finally {
            console.log('restoreSession: finished, setting isLoading false');
            set({ isLoading: false });
        }
    },
}));
