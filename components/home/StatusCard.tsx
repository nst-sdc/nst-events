import { GlassView } from '@/components/ui/GlassView';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StatusCardProps {
    status: 'approved' | 'pending';
    location?: string;
    time?: string;
}

export function StatusCard({ status, location, time }: StatusCardProps) {
    const isApproved = status === 'approved';
    const borderColor = isApproved ? '#00FF00' : '#FF00FF'; // Green or Purple
    const statusText = isApproved ? 'CHECKED IN' : 'PENDING APPROVAL';
    const statusIcon = isApproved ? 'checkmark-circle' : 'time';

    return (
        <GlassView style={[styles.container, { borderColor }]} intensity={10}>
            <View style={styles.header}>
                <Ionicons name={statusIcon} size={24} color={borderColor} />
                <ThemedText variant="h3" style={[styles.statusText, { color: borderColor }]}>
                    {statusText}
                </ThemedText>
            </View>

            {isApproved && (
                <View style={styles.details}>
                    <View style={styles.row}>
                        <ThemedText style={styles.label}>LOCATION</ThemedText>
                        <ThemedText variant="h2" style={styles.value}>{location || 'Not Assigned'}</ThemedText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <ThemedText style={styles.label}>REPORTING TIME</ThemedText>
                        <ThemedText variant="h2" style={styles.value}>{time || '--:--'}</ThemedText>
                    </View>
                </View>
            )}

            {!isApproved && (
                <ThemedText style={styles.pendingMessage}>
                    Please proceed to the registration desk to scan your QR code.
                </ThemedText>
            )}
        </GlassView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: Spacing.l,
        marginBottom: Spacing.xl,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.l,
    },
    statusText: {
        marginLeft: Spacing.s,
        letterSpacing: 1,
    },
    details: {
        gap: Spacing.m,
    },
    row: {
        gap: 4,
    },
    label: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        letterSpacing: 1,
    },
    value: {
        color: '#FFF',
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: Spacing.s,
    },
    pendingMessage: {
        color: Colors.dark.textSecondary,
        fontStyle: 'italic',
    }
});
