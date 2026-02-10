import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS, SPACING, RADIUS, PALETTE } from '../constants/theme';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'success' | 'warning';
    colors?: readonly [string, string, ...string[]];
    textStyle?: TextStyle;
    style?: ViewStyle;
    disabled?: boolean;
}

export function GradientButton({
    title,
    onPress,
    variant = 'primary',
    colors, // Allow overriding, but default based on variant
    textStyle,
    style,
    disabled,
    ...props
}: GradientButtonProps) {

    const getGradientColors = () => {
        if (colors) return colors;
        switch (variant) {
            case 'success': return GRADIENTS.success;
            case 'warning': return GRADIENTS.warning;
            default: return GRADIENTS.primary;
        }
    };

    const gradientColors = getGradientColors();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled}
            {...props}
            style={[styles.container, style, disabled && styles.disabled]}
        >
            <LinearGradient
                colors={[...gradientColors]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.round,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    disabled: {
        opacity: 0.6,
    },
    gradient: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: PALETTE.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
