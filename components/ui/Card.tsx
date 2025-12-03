import { Colors, Layout, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleProp, StyleSheet, useColorScheme, View, ViewStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'elevated' | 'outlined' | 'flat' | 'glow';
    glowColor?: 'primary' | 'secondary' | 'error';
    padding?: keyof typeof Spacing;
}

export function Card({
    children,
    style,
    variant = 'elevated',
    glowColor = 'primary',
    padding = 'l'
}: CardProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getVariantStyle = () => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: colors.surface,
                    ...Layout.shadow.medium,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: colors.border,
                };
            case 'flat':
                return {
                    backgroundColor: colors.surfaceHighlight,
                };
            case 'glow':
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...Layout.shadow.glow[glowColor],
                };
        }
    };

    return (
        <View
            style={[
                styles.container,
                { padding: Spacing[padding], borderRadius: Layout.radius.m },
                getVariantStyle(),
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'visible', // Allow glow to show
    },
});
