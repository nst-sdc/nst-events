import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <View style={styles.container}>
                <ThemedText variant="h1" style={styles.title}>This screen doesn't exist.</ThemedText>
                <Link href="/" style={styles.link}>
                    <ThemedText variant="body" style={styles.linkText}>Go to home screen!</ThemedText>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.l,
        backgroundColor: Colors.dark.background,
    },
    title: {
        marginBottom: Spacing.l,
    },
    link: {
        marginTop: Spacing.l,
        paddingVertical: Spacing.l,
    },
    linkText: {
        color: Colors.dark.primary,
    },
});
