import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../context/authStore';
import { PALETTE, GRADIENTS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientSpinner } from '../components/GradientSpinner';

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
                setTimeout(() => router.replace('/admin/dashboard' as any), 0);
            } else if (user.role === 'participant') {
                if (user.approved) {
                    setTimeout(() => router.replace('/participant/home'), 0);
                } else {
                    setTimeout(() => router.replace('/participant/map'), 0);
                }
            } else if (user.role === 'superadmin') {
                setTimeout(() => router.replace('/admin/dashboard' as any), 0);
            }
        }
    }, [isAuthenticated, user, isLoading, segments, router, rootNavigationState]);

    return (
        <LinearGradient
            colors={[...GRADIENTS.header]}
            style={styles.container}
        >
            <GradientSpinner size={60} colors={[PALETTE.white, PALETTE.blueLight]} />
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
