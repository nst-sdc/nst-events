import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { PALETTE, RADIUS, SPACING } from '../constants/theme';

interface CardProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}

export function Card({ style, children, ...props }: CardProps) {
    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: PALETTE.creamDark,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
