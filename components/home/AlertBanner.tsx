import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

interface AlertBannerProps {
    message: string;
    type?: 'info' | 'warning' | 'error';
}

export function AlertBanner({ message, type = 'info' }: AlertBannerProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getColors = () => {
        switch (type) {
            case 'warning':
                return { bg: colors.warning + '15', text: colors.warning, icon: 'warning' as const };
            case 'error':
                return { bg: colors.error + '15', text: colors.error, icon: 'alert-circle' as const };
            default:
                return { bg: colors.info + '15', text: colors.info, icon: 'information-circle' as const };
        }
    };

    const { bg, text, icon } = getColors();

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={20} color={text} style={styles.icon} />
            <Text style={[styles.text, { color: text }]}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.m,
        borderRadius: Layout.radius.m,
        marginBottom: Spacing.l,
    },
    icon: {
        marginRight: Spacing.s,
    },
    text: {
        flex: 1,
        fontSize: 14,
        fontFamily: Fonts.sans,
        fontWeight: '500',
    },
});
