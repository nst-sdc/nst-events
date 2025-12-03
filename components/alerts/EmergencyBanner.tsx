import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

interface EmergencyBannerProps {
    message: string;
    visible: boolean;
}

export function EmergencyBanner({ message, visible }: EmergencyBannerProps) {
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (visible) {
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 800 }),
                    withTiming(1, { duration: 800 })
                ),
                -1,
                true
            );
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (!visible) return null;

    return (
        <Animated.View
            entering={FadeInDown}
            exiting={FadeOutUp}
            style={[styles.container, animatedStyle]}
        >
            <View style={styles.content}>
                <Ionicons name="warning" size={32} color="#FFF" />
                <View style={styles.textContainer}>
                    <ThemedText variant="h3" style={styles.title}>EMERGENCY ALERT</ThemedText>
                    <ThemedText style={styles.message}>{message}</ThemedText>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0, // Stick to bottom or top depending on design preference. Bottom is less intrusive but visible.
        left: 0,
        right: 0,
        backgroundColor: Colors.dark.error,
        padding: Spacing.m,
        paddingBottom: Spacing.xl, // Safe area
        zIndex: 9999,
        borderTopWidth: 2,
        borderColor: '#FFF',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        marginLeft: Spacing.m,
        flex: 1,
    },
    title: {
        color: '#FFF',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    message: {
        color: '#FFF',
        fontWeight: '600',
    }
});
