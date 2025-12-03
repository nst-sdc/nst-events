import { Card } from '@/components/ui/Card';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface ActionItem {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

const ACTIONS: ActionItem[] = [
    { id: 'schedule', label: 'Schedule', icon: 'calendar', color: '#3B82F6' },
    { id: 'map', label: 'Map', icon: 'map', color: '#10B981' },
    { id: 'rules', label: 'Rules', icon: 'book', color: '#8B5CF6' },
    { id: 'contact', label: 'Help', icon: 'help-circle', color: '#F59E0B' },
];

export function QuickActions() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.grid}>
                {ACTIONS.map((action) => (
                    <TouchableOpacity key={action.id} style={styles.itemWrapper} activeOpacity={0.8}>
                        <Card variant="flat" padding="m" style={styles.card}>
                            <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
                                <Ionicons name={action.icon} size={24} color={action.color} />
                            </View>
                            <Text style={[styles.label, { color: colors.text }]}>{action.label}</Text>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: 18,
        fontFamily: Fonts.sans,
        fontWeight: 'bold',
        marginBottom: Spacing.m,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.m,
    },
    itemWrapper: {
        width: '47%', // Slightly less than 50% to account for gap
    },
    card: {
        alignItems: 'center',
        paddingVertical: Spacing.l,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: Layout.radius.round,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.s,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});
