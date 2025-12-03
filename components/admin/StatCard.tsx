import { GlassView } from '@/components/ui/GlassView';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet } from 'react-native';

interface StatCardProps {
    value: string | number;
    label: string;
}

export function StatCard({ value, label }: StatCardProps) {
    return (
        <GlassView style={styles.container} intensity={15}>
            <ThemedText variant="h2" style={styles.value}>{value}</ThemedText>
            <ThemedText variant="caption" style={styles.label}>{label}</ThemedText>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.l,
        borderRadius: 12,
        alignItems: 'center',
        width: '45%', // Slightly less than half to allow gap
        marginBottom: Spacing.m,
        overflow: 'hidden',
    },
    value: {
        color: '#FFF',
        marginBottom: 4,
        textShadowColor: 'rgba(255, 255, 255, 0.2)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    label: {
        color: Colors.dark.textSecondary,
        textTransform: 'uppercase',
        textAlign: 'center',
    }
});
