import { Colors, Layout, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { ThemedText } from './Typography';

interface ToastProps {
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
    visible: boolean;
    onHide: () => void;
    duration?: number;
}

export function Toast({ message, type = 'info', visible, onHide, duration = 3000 }: ToastProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onHide, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onHide]);

    if (!visible) return null;

    const getColors = () => {
        switch (type) {
            case 'success':
                return { bg: colors.success, icon: 'checkmark-circle' as const };
            case 'warning':
                return { bg: colors.warning, icon: 'warning' as const };
            case 'error':
                return { bg: colors.error, icon: 'alert-circle' as const };
            case 'info':
                return { bg: colors.info, icon: 'information-circle' as const };
        }
    };

    const { bg, icon } = getColors();

    return (
        <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={[
                styles.container,
                { backgroundColor: colors.surface, borderColor: bg, ...Layout.shadow.medium },
            ]}
        >
            <View style={[styles.accent, { backgroundColor: bg }]} />
            <Ionicons name={icon} size={24} color={bg} style={styles.icon} />
            <ThemedText style={styles.text}>{message}</ThemedText>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60, // Below status bar
        left: Spacing.l,
        right: Spacing.l,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.m,
        borderRadius: Layout.radius.s,
        borderWidth: 1,
        zIndex: 1000,
    },
    accent: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderTopLeftRadius: Layout.radius.s,
        borderBottomLeftRadius: Layout.radius.s,
    },
    icon: {
        marginLeft: Spacing.s,
        marginRight: Spacing.m,
    },
    text: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
});
