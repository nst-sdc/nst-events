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
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightPress?: () => void;
}

export function AppHeader({ title, showBack = false, rightIcon, onRightPress }: AppHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={[...GRADIENTS.header]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={PALETTE.white} />
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>{title}</Text>
            </View>

            {rightIcon && (
                <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
                    <Ionicons name={rightIcon} size={24} color={PALETTE.white} />
                </TouchableOpacity>
            )}
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
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: SPACING.m,
    },
    title: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.white,
        fontSize: 20,
    },
    rightButton: {
        padding: SPACING.s,
    },
});
