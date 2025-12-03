import { GlassView } from '@/components/ui/GlassView';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

interface EventCardProps {
    eventName: string;
    location: string;
    time: string;
    isApproved: boolean;
    onPress?: () => void;
}

export function EventCard({ eventName, location, time, isApproved, onPress }: EventCardProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    if (!isApproved) {
        return (
            <GlassView style={[styles.container, { borderColor: colors.warning }]} intensity={10}>
                <View style={styles.pendingContainer}>
                    <Ionicons name="alert-circle" size={32} color={colors.warning} />
                    <ThemedText variant="h3" style={{ marginTop: Spacing.s, marginBottom: Spacing.xs }}>Check-in Required</ThemedText>
                    <ThemedText variant="body" style={{ textAlign: 'center', color: colors.textSecondary }}>
                        Complete your check-in at the reception desk to view your event details.
                    </ThemedText>
                </View>
            </GlassView>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <GlassView style={styles.container} intensity={20}>
                <View style={styles.header}>
                    <ThemedText variant="caption" style={{ color: colors.primary, fontWeight: '700', letterSpacing: 1 }}>ASSIGNED EVENT</ThemedText>
                    <Ionicons name="chevron-forward" size={20} color={colors.icon} />
                </View>

                <ThemedText variant="h2" style={{ marginBottom: Spacing.l }}>{eventName}</ThemedText>

                <View style={styles.divider} />

                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={20} color={colors.textSecondary} style={styles.icon} />
                        <View>
                            <ThemedText variant="caption">Reporting Time</ThemedText>
                            <ThemedText variant="body" style={{ fontWeight: '600' }}>{time}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={20} color={colors.textSecondary} style={styles.icon} />
                        <View>
                            <ThemedText variant="caption">Location</ThemedText>
                            <ThemedText variant="body" style={{ fontWeight: '600' }}>{location}</ThemedText>
                        </View>
                    </View>
                </View>
            </GlassView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.l,
        padding: Spacing.l,
        borderRadius: 16,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.s,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: Spacing.l,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: Spacing.s,
    },
    pendingContainer: {
        alignItems: 'center',
        padding: Spacing.m,
    },
});
