import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Badge {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
    type: string;
}

interface ParticipantBadge {
    id: string;
    badge: Badge;
    awardedAt: string;
}

interface BadgeGridProps {
    badges: ParticipantBadge[];
}

export const BadgeGrid = ({ badges }: BadgeGridProps) => {
    const renderItem = ({ item }: { item: ParticipantBadge }) => (
        <View style={styles.badgeCard}>
            <View style={styles.iconContainer}>
                {item.badge.iconUrl ? (
                    <Image source={{ uri: item.badge.iconUrl }} style={styles.icon} />
                ) : (
                    <Ionicons name="trophy" size={24} color={PALETTE.primaryOrange} />
                )}
            </View>
            <Text style={styles.badgeName} numberOfLines={1}>{item.badge.name}</Text>
            <Text style={styles.badgeDate}>{new Date(item.awardedAt).toLocaleDateString()}</Text>
        </View>
    );

    if (badges.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No badges yet. Participate to earn!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Badges</Text>
            <FlatList
                data={badges}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={styles.row}
                scrollEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.l,
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        marginBottom: SPACING.m,
    },
    row: {
        gap: SPACING.s,
    },
    badgeCard: {
        flex: 1,
        backgroundColor: PALETTE.white,
        padding: SPACING.s,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        marginBottom: SPACING.s,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: PALETTE.blueLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    icon: {
        width: 32,
        height: 32,
    },
    badgeName: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    badgeDate: {
        fontSize: 10,
        color: PALETTE.mediumGray,
    },
    emptyContainer: {
        padding: SPACING.l,
        alignItems: 'center',
        backgroundColor: PALETTE.bgLight,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
    },
});
