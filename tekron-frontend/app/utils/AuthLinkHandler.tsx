import { useEffect } from 'react';
import { Linking } from 'react-native';
import { storage } from '../../utils/storage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { BACKEND_URL } from '../../constants/config';
import { useAuthStore } from '../../context/authStore';

export default function AuthLinkHandler() {
    const setSession = useAuthStore((state) => state.setSession);

    useEffect(() => {
        // 1. Cold Start Handling
        const handleInitialURL = async () => {
            const url = await Linking.getInitialURL();
            if (url) handleDeepLink({ url });
        };

        // 2. Runtime Handling (Background/Foreground)
        const subscription = Linking.addEventListener('url', handleDeepLink);

        handleInitialURL();

        return () => {
            subscription.remove();
        };
    }, []);

    const handleDeepLink = async (event: { url: string }) => {
        const { url } = event;
        // Check if it's our auth callback
        if (!url || !url.includes('auth/callback')) return;



        try {
            // Extract token from query params
            // URL format: tekron://auth/callback?token=XYZ
            const token = new URL(url).searchParams.get('token');

            if (!token) {
                // Fallback parsing if URL object fails in some RN environments
                const match = url.match(/token=([^&]*)/);
                if (match) return loginWithToken(match[1]);

                Toast.show({ type: 'error', text1: 'Login Failed', text2: 'No token found in link.' });
                return;
            }

            loginWithToken(token);

        } catch (error) {
            console.error('Deep link parsing error:', error);
            Toast.show({ type: 'error', text1: 'Login Failed', text2: 'Invalid link.' });
        }
    };

    const loginWithToken = async (token: string) => {
        try {
            Toast.show({ type: 'info', text1: 'Verifying Login...', text2: 'Please wait.' });

            const response = await fetch(`${BACKEND_URL}/api/auth/verify-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            // Success!
            await storage.setItem('session_token', data.token);
            setSession(data.user, data.token);

            Toast.show({ type: 'success', text1: 'Welcome!', text2: `Logged in as ${data.user.email}` });

            // Redirect to Dashboard
            if (data.role === 'admin' || data.role === 'superadmin') {
                router.replace('/admin/dashboard' as any);
            } else {
                if (data.user.approved) {
                    router.replace('/participant/home');
                } else {
                    router.replace('/participant/map');
                }
            }

        } catch (error: any) {
            console.error('Magic Login Error:', error);
            Toast.show({ type: 'error', text1: 'Login Failed', text2: error.message });
        }
    };

    return null;
}
