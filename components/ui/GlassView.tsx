import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';

interface GlassViewProps extends ViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
}

export function GlassView({
    style,
    intensity = 20,
    tint = 'dark',
    children,
    ...rest
}: GlassViewProps) {

    if (Platform.OS === 'android') {
        return (
            <View
                style={[
                    styles.androidFallback,
                    style
                ]}
                {...rest}
            >
                {children}
            </View>
        );
    }

    return (
        <BlurView
            intensity={intensity}
            tint={tint}
            style={[styles.container, style]}
            {...rest}
        >
            {children}
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 20, 0.6)', // Slight tint for iOS
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
    },
    androidFallback: {
        backgroundColor: 'rgba(30, 30, 30, 0.9)', // Solid fallback for Android
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
    }
});
