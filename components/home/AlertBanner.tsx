import { ThemedText } from '@/components/ui/Typography';
import { Colors, Layout, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

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
            <ThemedText variant="body" style={{ flex: 1, color: text, fontWeight: '500' }}>{message}</ThemedText>
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
});
