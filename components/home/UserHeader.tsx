import { Badge } from '@/components/ui/Badge';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';

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
                <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
                <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
                <View style={styles.roleContainer}>
                    <Text style={[styles.role, { color: colors.primary }]}>{role}</Text>
                    <View style={styles.dot} />
                    <Badge
                        label={status === 'approved' ? 'Checked In' : 'Pending'}
                        status={status === 'approved' ? 'success' : 'warning'}
                        animate={status === 'approved'}
                    />
                </View>
            </View>
            <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceHighlight }]}>
                        <Text style={[styles.avatarText, { color: colors.textSecondary }]}>
                            {name.charAt(0)}
                        </Text>
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
    greeting: {
        fontSize: 14,
        fontFamily: Fonts.sans,
        marginBottom: Spacing.xs,
    },
    name: {
        fontSize: 24,
        fontFamily: Fonts.sans,
        fontWeight: 'bold',
        marginBottom: Spacing.s,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    role: {
        fontSize: 14,
        fontFamily: Fonts.sans,
        fontWeight: '600',
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
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
