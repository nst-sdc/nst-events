import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, TextStyle, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, GRADIENTS, RADIUS, SPACING } from '../constants/theme';

interface GradientButtonProps extends TouchableOpacityProps {
    title: string;
    colors?: readonly [string, string, ...string[]];
    textStyle?: TextStyle;
    style?: ViewStyle;
}

export function GradientButton({ title, colors = GRADIENTS.primary, textStyle, style, ...props }: GradientButtonProps) {
    return (
        <TouchableOpacity activeOpacity={0.8} {...props} style={[styles.container, style]}>
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.m,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
