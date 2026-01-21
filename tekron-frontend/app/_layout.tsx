import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { Rajdhani_500Medium, Rajdhani_600SemiBold, Rajdhani_700Bold } from '@expo-google-fonts/rajdhani';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../context/authStore';
import { StatusBar } from 'expo-status-bar';
import { THEME } from '../constants/theme';
import Toast from 'react-native-toast-message';
import AuthLinkHandler from './utils/AuthLinkHandler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const restoreSession = useAuthStore((state) => state.restoreSession);
    const [fontsLoaded] = useFonts({
        Orbitron_700Bold,
        Rajdhani_500Medium,
        Rajdhani_600SemiBold,
        Rajdhani_700Bold,
    });

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }



    return (
        <>
            <StatusBar style="light" backgroundColor={THEME.dark.background} />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.dark.background } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="admin/dashboard" />
                <Stack.Screen name="participant" />
            </Stack>
            <AuthLinkHandler />
            <Toast />
        </>
    );
}
