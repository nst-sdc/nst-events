import { Colors, Layout, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native';
import { ThemedText } from './Typography';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: 'filled' | 'outline' | 'ghost' | 'pixel' | 'glow';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export function Button({
    label,
    onPress,
    variant = 'filled',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}: ButtonProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getVariantStyle = () => {
        switch (variant) {
            case 'filled':
                return {
                    backgroundColor: disabled ? colors.textMuted : colors.primary,
                    borderWidth: 0,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: disabled ? colors.textMuted : colors.primary,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                };
            case 'pixel':
                return {
                    backgroundColor: disabled ? colors.textMuted : 'transparent',
                    borderWidth: 2,
                    borderColor: colors.primary,
                    borderStyle: 'dashed' as const, // Pixel-like border
                };
            case 'glow':
                return {
                    backgroundColor: disabled ? colors.textMuted : colors.primary,
                    borderWidth: 0,
                    ...Layout.shadow.glow.primary,
                };
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.m };
            case 'medium':
                return { paddingVertical: Spacing.m, paddingHorizontal: Spacing.l };
            case 'large':
                return { paddingVertical: Spacing.l, paddingHorizontal: Spacing.xl };
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.surface;
        if (variant === 'filled' || variant === 'glow') return '#000000'; // Black text on neon
        if (variant === 'pixel') return colors.primary;
        return colors.primary;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.container,
                getSizeStyle(),
                getVariantStyle(),
                (variant === 'filled' || variant === 'glow' || variant === 'outline') && { borderRadius: Layout.radius.s },
                variant === 'pixel' && { borderRadius: 0 }, // Sharp corners for pixel
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <ThemedText
                        style={[
                            Typography.button,
                            { color: getTextColor(), marginLeft: icon ? Spacing.s : 0 },
                            textStyle,
                        ]}
                    >
                        {label}
                    </ThemedText>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
