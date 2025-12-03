import { GlassView } from '@/components/ui/GlassView';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export type AlertSeverity = 'info' | 'warning' | 'emergency';

interface AlertCardProps {
    title: string;
    message: string;
    timestamp: string;
    severity: AlertSeverity;
}

export function AlertCard({ title, message, timestamp, severity }: AlertCardProps) {
    const getSeverityStyles = () => {
        switch (severity) {
            case 'emergency':
                return {
                    borderColor: Colors.dark.error,
                    icon: 'warning' as const,
                    iconColor: Colors.dark.error,
                };
            case 'warning':
                return {
                    borderColor: Colors.dark.warning,
                    icon: 'alert-circle' as const,
                    iconColor: Colors.dark.warning,
                };
            case 'info':
            default:
                return {
                    borderColor: Colors.dark.info,
                    icon: 'information-circle' as const,
                    iconColor: Colors.dark.info,
                };
        }
    };

    const { borderColor, icon, iconColor } = getSeverityStyles();

    return (
        <GlassView style={[styles.container, { borderColor }]} intensity={10}>
            <View style={styles.header}>
                <Ionicons name={icon} size={24} color={iconColor} />
                <ThemedText variant="h3" style={[styles.title, { color: iconColor }]}>
                    {title}
                </ThemedText>
            </View>

            <ThemedText style={styles.message}>{message}</ThemedText>

            <ThemedText variant="caption" style={styles.timestamp}>
                {timestamp}
            </ThemedText>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: Spacing.m,
        borderLeftWidth: 4,
        marginBottom: Spacing.m,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.s,
    },
    title: {
        marginLeft: Spacing.s,
        textTransform: 'uppercase',
    },
    message: {
        color: '#DDD',
        marginBottom: Spacing.s,
        lineHeight: 20,
    },
    timestamp: {
        color: Colors.dark.textSecondary,
        textAlign: 'right',
        fontSize: 10,
    }
});
