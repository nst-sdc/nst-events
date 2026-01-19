import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../context/authStore';
import { PALETTE, GRADIENTS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const segments = useSegments();
    const rootNavigationState = useRootNavigationState();

    useEffect(() => {

        if (isLoading || !rootNavigationState?.key) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!isAuthenticated) {
            if (!inAuthGroup) {

                setTimeout(() => router.replace('/auth/login'), 0);
            }
        } else if (user) {

            if (user.role === 'admin' || user.role === 'superadmin') {
                setTimeout(() => router.replace('/admin/dashboard'), 0);
            } else if (user.role === 'participant') {
                if (user.approved) {
                    setTimeout(() => router.replace('/participant/home'), 0);
                } else {
                    setTimeout(() => router.replace('/participant/map'), 0);
                }
            } else if (user.role === 'superadmin') {
                setTimeout(() => router.replace('/admin/dashboard'), 0);
            }
        }
    }, [isAuthenticated, user, isLoading, segments, router, rootNavigationState]);

    return (
        <LinearGradient
            colors={[...GRADIENTS.header]}
            style={styles.container}
        >
            <ActivityIndicator size="large" color={PALETTE.white} />
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
