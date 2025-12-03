import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
import { StatusBar } from 'expo-status-bar';
import { THEME } from '../constants/theme';

export default function RootLayout() {
    const restoreSession = useAuthStore((state) => state.restoreSession);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return (
        <>
            <StatusBar style="light" backgroundColor={THEME.dark.background} />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.dark.background } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="admin/dashboard" />
                <Stack.Screen name="participant/home" />
                <Stack.Screen name="participant/map" />
            </Stack>
        </>
    );
}
