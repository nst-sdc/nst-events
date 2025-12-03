import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/useAuthStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loaded = true;
  const { session, checkSession, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const inAdminGroup = segments[0] === 'admin';
    const inLimitedGroup = segments[0] === 'limited';
    const isLoginScreen = segments[0] === 'login';

    if (!session) {
      // If not authenticated and not on login screen, redirect to login
      if (!isLoginScreen) {
        router.replace('/login');
      }
    } else {
      // Authenticated
      const { role, approved } = useAuthStore.getState();

      if (role === 'admin') {
        // Admin routing
        if (!inAdminGroup) {
          router.replace('/admin/dashboard');
        }
      } else {
        // Participant routing
        if (approved) {
          // Approved participant -> Main App (Tabs)
          // We check if we are NOT in the tabs group. 
          // Note: segments[0] might be undefined if at root, which is fine.
          if (segments[0] !== '(tabs)') {
            router.replace('/(tabs)');
          }
        } else {
          // Unapproved participant -> Limited Map Mode
          if (!inLimitedGroup) {
            router.replace('/limited/map');
          }
        }
      }
    }
  }, [session, isLoading, segments]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="gallery" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
