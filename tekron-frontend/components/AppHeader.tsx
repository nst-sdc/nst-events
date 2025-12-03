import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY } from '../constants/theme';

interface AppHeaderProps {
    title: string;
    showBack?: boolean;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightPress?: () => void;
}

export function AppHeader({ title, showBack = false, rightIcon, onRightPress }: AppHeaderProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={PALETTE.creamLight} />
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>{title}</Text>
            </View>

            {rightIcon && (
                <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
                    <Ionicons name={rightIcon} size={24} color={PALETTE.creamLight} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
        backgroundColor: PALETTE.purpleDeep,
        paddingTop: SPACING.xl, // Status bar padding
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
        color: PALETTE.creamLight,
        fontSize: 20,
    },
    rightButton: {
        padding: SPACING.xs,
    },
});
