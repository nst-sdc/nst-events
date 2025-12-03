import { Colors, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';
import { ThemedText } from './Typography';

interface PixelBadgeProps {
    label: string;
    status?: 'success' | 'warning' | 'error' | 'info' | 'default';
    style?: ViewStyle;
}

export function PixelBadge({ label, status = 'default', style }: PixelBadgeProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getStatusColors = () => {
        switch (status) {
            case 'success':
                return { bg: 'transparent', text: colors.success, border: colors.success };
            case 'warning':
                return { bg: 'transparent', text: colors.warning, border: colors.warning };
            case 'error':
                return { bg: 'transparent', text: colors.error, border: colors.error };
            case 'info':
                return { bg: 'transparent', text: colors.info, border: colors.info };
            default:
                return { bg: 'transparent', text: colors.textSecondary, border: colors.border };
        }
    };

    const { bg, text, border } = getStatusColors();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: bg, borderColor: border },
                style,
            ]}
        >
            <ThemedText style={[styles.text, { color: text }]}>{label}</ThemedText>
            {/* Pixel corners */}
            <View style={[styles.corner, styles.topLeft, { borderTopColor: border, borderLeftColor: border }]} />
            <View style={[styles.corner, styles.topRight, { borderTopColor: border, borderRightColor: border }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderBottomColor: border, borderLeftColor: border }]} />
            <View style={[styles.corner, styles.bottomRight, { borderBottomColor: border, borderRightColor: border }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.s,
        paddingVertical: 4,
        borderWidth: 1,
        alignSelf: 'flex-start',
        position: 'relative',
        margin: 2, // Space for corners
    },
    text: {
        fontSize: 10,
        fontFamily: Typography.button.fontFamily,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    corner: {
        position: 'absolute',
        width: 4,
        height: 4,
        backgroundColor: 'transparent',
    },
    topLeft: {
        top: -1,
        left: -1,
        borderTopWidth: 2,
        borderLeftWidth: 2,
    },
    topRight: {
        top: -1,
        right: -1,
        borderTopWidth: 2,
        borderRightWidth: 2,
    },
    bottomLeft: {
        bottom: -1,
        left: -1,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
    },
    bottomRight: {
        bottom: -1,
        right: -1,
        borderBottomWidth: 2,
        borderRightWidth: 2,
    },
});
