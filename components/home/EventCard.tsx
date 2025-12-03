import { Card } from '@/components/ui/Card';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

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
            <Card variant="outlined" style={[styles.container, { borderColor: colors.warning }]}>
                <View style={styles.pendingContainer}>
                    <Ionicons name="alert-circle" size={32} color={colors.warning} />
                    <Text style={[styles.pendingTitle, { color: colors.text }]}>Check-in Required</Text>
                    <Text style={[styles.pendingText, { color: colors.textSecondary }]}>
                        Complete your check-in at the reception desk to view your event details.
                    </Text>
                </View>
            </Card>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <Card variant="elevated" style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.label, { color: colors.primary }]}>ASSIGNED EVENT</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.icon} />
                </View>

                <Text style={[styles.eventName, { color: colors.text }]}>{eventName}</Text>

                <View style={styles.divider} />

                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={20} color={colors.textSecondary} style={styles.icon} />
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Reporting Time</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{time}</Text>
                        </View>
                    </View>

                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={20} color={colors.textSecondary} style={styles.icon} />
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Location</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{location}</Text>
                        </View>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.s,
    },
    label: {
        fontSize: 12,
        fontFamily: Fonts.sans,
        fontWeight: '700',
        letterSpacing: 1,
    },
    eventName: {
        fontSize: 22,
        fontFamily: Fonts.sans,
        fontWeight: 'bold',
        marginBottom: Spacing.l,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
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
    detailLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    pendingContainer: {
        alignItems: 'center',
        padding: Spacing.m,
    },
    pendingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: Spacing.s,
        marginBottom: Spacing.xs,
    },
    pendingText: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
});
