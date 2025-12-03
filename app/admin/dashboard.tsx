import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { StyleSheet, View } from 'react-native';

export default function AdminDashboard() {
    const { signOut } = useAuthStore();

    return (
        <View style={styles.container}>
            <ThemedText variant="h1" style={styles.title}>Admin Dashboard</ThemedText>
            <ThemedText variant="body" style={styles.subtitle}>Manage events and participants</ThemedText>

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
        color: '#FF00FF', // Neon Purple
        marginBottom: Spacing.m,
    },
    subtitle: {
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.xl,
    },
    button: {
        marginTop: Spacing.xl,
        borderColor: '#FF00FF',
    }
});
