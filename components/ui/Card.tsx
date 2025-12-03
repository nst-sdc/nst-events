import { Colors, Layout, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'elevated' | 'outlined' | 'flat';
    padding?: keyof typeof Spacing;
}

export function Card({ children, style, variant = 'elevated', padding = 'l' }: CardProps) {
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
        }
    };

    return (
        <View
            style={[
                styles.card,
                { padding: Spacing[padding], borderRadius: Layout.radius.xl },
                getVariantStyle(),
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        overflow: 'visible', // Needed for shadows on iOS
    },
});
