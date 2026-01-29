import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, GRADIENTS } from '../constants/theme';
import { router } from 'expo-router';

interface AppHeaderProps {
    title: string;
    showBack?: boolean;
    onBackPress?: () => void;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightPress?: () => void;
}

export function AppHeader({ title, showBack = false, onBackPress, rightIcon, onRightPress }: AppHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={[...GRADIENTS.header]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={[styles.titleContainer, { paddingTop: insets.top }]}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
            </View>

            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={onBackPress || (() => router.back())} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={PALETTE.white} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.rightContainer}>
                {rightIcon && (
                    <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
                        <Ionicons name={rightIcon} size={24} color={PALETTE.white} />
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.m,
        position: 'relative',
        minHeight: 60, // Ensure minimum touch target area
    },
    titleContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60, // Prevent overlap with buttons (approx 24+24+12)
        paddingBottom: SPACING.m,
        pointerEvents: 'none', // Allow clicks to pass through to buttons if they somehow overlap
    },
    title: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.white,
        fontSize: 18, // Slightly smaller to fit longer titles
        textAlign: 'center',
    },
    leftContainer: {
        zIndex: 1,
        minWidth: 40,
    },
    rightContainer: {
        zIndex: 1,
        minWidth: 40,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: SPACING.xs,
        marginLeft: -SPACING.xs, // Negative margin to align icon visually with grid
    },
    rightButton: {
        padding: SPACING.xs,
        marginRight: -SPACING.xs,
    },
});
