import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../context/authStore';
import { PALETTE } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!isAuthenticated) {
            if (!inAuthGroup) {
                router.replace('/auth/login');
            }
        } else if (user) {
            if (user.role === 'admin') {
                router.replace('/admin/dashboard');
            } else if (user.role === 'participant') {
                if (user.approved) {
                    router.replace('/participant/home');
                } else {
                    router.replace('/participant/map');
                }
            }
        }
    }, [isAuthenticated, user, isLoading, segments, router]);

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
