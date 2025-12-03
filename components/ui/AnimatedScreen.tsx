import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AnimatedScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
    delay?: number;
}

export function AnimatedScreen({ children, style, delay = 0 }: AnimatedScreenProps) {
    return (
        <Animated.View
            entering={FadeIn.delay(delay).duration(500)}
            style={[styles.container, style]}
        >
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    }
});
