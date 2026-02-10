import React from 'react';
import { StyleSheet, View, ViewStyle, ViewProps } from 'react-native';
import { PALETTE, RADIUS, SPACING } from '../constants/theme';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'highlight';
}

export function Card({ children, style, variant = 'default', ...props }: CardProps) {
    return (
        <View
            style={[
                styles.card,
                variant === 'highlight' && styles.highlight,
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        borderColor: PALETTE.blueLight,
        borderWidth: 1,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    highlight: {
        borderColor: PALETTE.primaryBlue,
        backgroundColor: PALETTE.blueLight,
    }
});
