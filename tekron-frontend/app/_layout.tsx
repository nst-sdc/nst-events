import {
    useFonts,
    Orbitron_400Regular,
    Orbitron_500Medium,
    Orbitron_600SemiBold,
    Orbitron_700Bold,
    Orbitron_800ExtraBold,
    Orbitron_900Black
} from '@expo-google-fonts/orbitron';
import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../context/authStore';
import { StatusBar } from 'expo-status-bar';
import { THEME } from '../constants/theme';
import Toast from 'react-native-toast-message';
import AuthLinkHandler from './utils/AuthLinkHandler';
import { View } from 'react-native';
import { toastConfig } from '../components/ToastConfig';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { SocketHandler } from '../components/SocketHandler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    usePushNotifications();
    const restoreSession = useAuthStore((state) => state.restoreSession);
    const [fontsLoaded] = useFonts({
        Orbitron_400Regular,
        Orbitron_500Medium,
        Orbitron_600SemiBold,
        Orbitron_700Bold,
        Orbitron_800ExtraBold,
        Orbitron_900Black,
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
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
        return <View />;
    }

    return (
        <>
            <StatusBar style="dark" backgroundColor={THEME.dark.background} />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.dark.background }, title: 'Tekron' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="admin/dashboard" />
                <Stack.Screen name="participant" />
            </Stack>
            <AuthLinkHandler />
            <SocketHandler />
            <Toast config={toastConfig} />
        </>
    );
}
