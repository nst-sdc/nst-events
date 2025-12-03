import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { StyleSheet, View } from 'react-native';

export default function LimitedMapMode() {
    const { signOut } = useAuthStore();

    return (
        <View style={styles.container}>
            <ThemedText variant="h1" style={styles.title}>Map Mode</ThemedText>
            <ThemedText variant="body" style={styles.subtitle}>
                Your account is pending approval. Please visit the reception desk.
            </ThemedText>

            <Button
                label="Sign Out"
                onPress={signOut}
                variant="outline"
                style={styles.button}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        padding: Spacing.l,
    },
    title: {
        color: '#00FFFF', // Neon Cyan
        marginBottom: Spacing.m,
    },
    subtitle: {
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    button: {
        marginTop: Spacing.xl,
        borderColor: '#00FFFF',
    }
});
