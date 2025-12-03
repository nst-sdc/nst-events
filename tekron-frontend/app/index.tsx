import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../context/authStore';
import { PALETTE } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const segments = useSegments();
    const rootNavigationState = useRootNavigationState();

    useEffect(() => {
        console.log('Index: effect triggered', { isLoading, isAuthenticated, user: user?.email, segments });
        if (isLoading || !rootNavigationState?.key) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!isAuthenticated) {
            if (!inAuthGroup) {
                console.log('Index: redirecting to login');
                router.replace('/auth/login');
            }
        } else if (user) {
            console.log('Index: authenticated user role:', user.role);
            if (user.role === 'admin' || user.role === 'superadmin') {
                router.replace('/admin/dashboard');
            } else if (user.role === 'participant') {
                if (user.approved) {
                    router.replace('/participant/home');
                } else {
                    router.replace('/participant/map');
                }
            } else if (user.role === 'superadmin') {
                router.replace('/admin/dashboard');
            }
        }
    }, [isAuthenticated, user, isLoading, segments, router, rootNavigationState]);

    return (
        <LinearGradient
            colors={[PALETTE.purpleDeep, PALETTE.purpleDark]}
            style={styles.container}
        >
            <ActivityIndicator size="large" color={PALETTE.creamLight} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
