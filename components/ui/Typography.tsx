import { Colors, Typography as TypoStyles } from '@/constants/theme';
import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
    variant?: keyof typeof TypoStyles;
    color?: keyof typeof Colors.light;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function ThemedText({
    style,
    variant = 'body',
    color = 'text',
    align = 'left',
    ...rest
}: ThemedTextProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <Text
            style={[
                TypoStyles[variant],
                { color: colors[color as keyof typeof colors], textAlign: align },
                style,
            ]}
            {...rest}
        />
    );
}
