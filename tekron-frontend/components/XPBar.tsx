import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';

interface XPBarProps {
    xp: number;
    level: number;
    progress: number; // 0 to 100
    nextLevelXp: number;
}

export const XPBar = ({ xp, level, progress, nextLevelXp }: XPBarProps) => {
    const progressPercent = Math.min(Math.max(progress / nextLevelXp, 0), 1);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>LVL {level}</Text>
                </View>
                <Text style={styles.xpText}>{xp} XP</Text>
            </View>
            <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${progressPercent * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress} / {nextLevelXp} XP to Level {level + 1}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    levelBadge: {
        backgroundColor: PALETTE.primaryOrange,
        paddingHorizontal: SPACING.s,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
    },
    levelText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    xpText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryBlue,
    },
    barContainer: {
        height: 8,
        backgroundColor: PALETTE.blueLight,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    barFill: {
        height: '100%',
        backgroundColor: PALETTE.primaryMint,
        borderRadius: 4,
    },
    progressText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        fontSize: 10,
        textAlign: 'right',
    },
});
