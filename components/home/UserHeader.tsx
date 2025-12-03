import { PixelBadge } from '@/components/ui/PixelBadge';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Layout, Spacing } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, useColorScheme, View } from 'react-native';

interface UserHeaderProps {
    name: string;
    role: string;
    status: 'approved' | 'pending';
    avatarUrl?: string;
}

export function UserHeader({ name, role, status, avatarUrl }: UserHeaderProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <ThemedText variant="caption" style={{ marginBottom: Spacing.xs }}>Welcome back,</ThemedText>
                <ThemedText variant="h2" style={{ marginBottom: Spacing.s }}>{name}</ThemedText>
                <View style={styles.roleContainer}>
                    <ThemedText variant="body" style={{ color: colors.primary, fontWeight: '600' }}>{role}</ThemedText>
                    <View style={styles.dot} />
                    <PixelBadge
                        label={status === 'approved' ? 'Checked In' : 'Pending'}
                        status={status === 'approved' ? 'success' : 'warning'}
                    />
                </View>
            </View>
            <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceHighlight }]}>
                        <ThemedText variant="h3" style={{ color: colors.textSecondary }}>
                            {name.charAt(0)}
                        </ThemedText>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    textContainer: {
        flex: 1,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
        marginHorizontal: Spacing.s,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: Layout.radius.round,
        borderWidth: 2,
        overflow: 'hidden',
        marginLeft: Spacing.m,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
