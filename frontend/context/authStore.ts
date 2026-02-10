import { create } from 'zustand';
import { storage } from '../utils/storage';
import { router } from 'expo-router';
import { BACKEND_URL } from '../constants/config';

// Define the shape of the user object
interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'participant' | 'superadmin';
    approved?: boolean;
    qrCode?: string;
    assignedEventId?: string;
    xp?: number;
    level?: number;
    pushToken?: string;
    approvedBy?: { id: string; name: string; email: string };
    approvedAt?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
    setSession: (user: User, token: string) => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

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

            await storage.setItem('token', token);
            await storage.setItem('user', JSON.stringify(user));

            set({ user, isAuthenticated: true, isLoading: false });

            // Redirect based on role
            if (role === 'superadmin') {
                router.replace('/admin/dashboard' as any);
            } else if (role === 'admin') {
                router.replace('/admin/dashboard' as any);
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
        await storage.removeItem('token');
        await storage.removeItem('user');
        set({ user: null, isAuthenticated: false });
        router.replace('/auth/login');
    },

    setSession: async (user, token) => {
        await storage.setItem('token', token);
        await storage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
    },

    restoreSession: async () => {
        set({ isLoading: true });
        try {
            const token = await storage.getItem('token');
            const userString = await storage.getItem('user');

            if (token && userString) {
                const user = JSON.parse(userString);
                set({ user, isAuthenticated: true });
            }
        } catch (error) {
            console.error('Restore session error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
            const newUser = { ...user, ...updates };
            set({ user: newUser });
            storage.setItem('user', JSON.stringify(newUser));
        }
    },
}));
