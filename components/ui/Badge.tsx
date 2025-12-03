import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, Text, ViewStyle, useColorScheme } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface BadgeProps {
    label: string;
    status?: 'success' | 'warning' | 'error' | 'info' | 'default';
    style?: ViewStyle;
    animate?: boolean;
}

export function Badge({ label, status = 'default', style, animate = false }: BadgeProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (animate && status === 'success') {
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                true
            );
        }
    }, [animate, status, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const getStatusColors = () => {
        switch (status) {
            case 'success':
                return { bg: colors.success + '20', text: colors.success }; // 20% opacity
            case 'warning':
                return { bg: colors.warning + '20', text: colors.warning };
            case 'error':
                return { bg: colors.error + '20', text: colors.error };
            case 'info':
                return { bg: colors.info + '20', text: colors.info };
            default:
                return { bg: colors.surfaceHighlight, text: colors.textSecondary };
        }
    };

    const { bg, text } = getStatusColors();

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: bg, borderColor: bg },
                animatedStyle,
                style,
            ]}
        >
            <Text style={[styles.text, { color: text }]}>{label}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.xs,
        borderRadius: Layout.radius.round,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
