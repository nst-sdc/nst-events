import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
    session: Session | null;
    user: User | null;
    role: 'admin' | 'participant' | null;
    approved: boolean;
    isLoading: boolean;
    setSession: (session: Session | null) => Promise<void>;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    role: null,
    approved: false,
    isLoading: true,
    setSession: async (session) => {
        if (!session?.user) {
            set({ session: null, user: null, role: null, approved: false, isLoading: false });
            return;
        }

        try {
            const { data: userData, error } = await supabase
                .from('users')
                .select('role, approval_status')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching user role:', error);
                // Fallback or handle error appropriately
                set({
                    session,
                    user: session.user,
                    role: 'participant', // Default fallback
                    approved: false,
                    isLoading: false
                });
                return;
            }

            set({
                session,
                user: session.user,
                role: userData.role as 'admin' | 'participant',
                approved: userData.approval_status === 'approved',
                isLoading: false
            });
        } catch (e) {
            console.error('Unexpected error setting session:', e);
            set({ session, user: session.user, role: null, approved: false, isLoading: false });
        }
    },
    signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, role: null, approved: false });
    },
    checkSession: async () => {
        set({ isLoading: true });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Reuse setSession logic to fetch role/status
                await useAuthStore.getState().setSession(session);
            } else {
                set({ session: null, user: null, role: null, approved: false, isLoading: false });
            }
        } catch (error) {
            console.error('Error checking session:', error);
            set({ isLoading: false });
        }
    },
}));
