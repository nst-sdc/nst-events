import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ScheduleItem {
    id: string;
    time: string;
    title: string;
    description?: string;
    isActive?: boolean;
}

interface ScheduleListProps {
    items: ScheduleItem[];
}

export function ScheduleList({ items }: ScheduleListProps) {
    return (
        <View style={styles.container}>
            <ThemedText variant="h3" style={styles.header}>SCHEDULE</ThemedText>

            <View style={styles.list}>
                {items.map((item, index) => (
                    <View key={item.id} style={styles.item}>
                        {/* Timeline Line */}
                        <View style={styles.timeline}>
                            <View style={[styles.dot, item.isActive && styles.activeDot]} />
                            {index !== items.length - 1 && <View style={styles.line} />}
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <ThemedText style={[styles.time, item.isActive && styles.activeText]}>
                                {item.time}
                            </ThemedText>
                            <ThemedText variant="body" style={[styles.title, item.isActive && styles.activeText]}>
                                {item.title}
                            </ThemedText>
                            {item.description && (
                                <ThemedText style={styles.description}>{item.description}</ThemedText>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Spacing.l,
    },
    header: {
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.l,
        letterSpacing: 2,
    },
    list: {
        paddingLeft: Spacing.s,
    },
    item: {
        flexDirection: 'row',
        marginBottom: Spacing.l,
    },
    timeline: {
        alignItems: 'center',
        marginRight: Spacing.l,
        width: 20,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#333',
        borderWidth: 2,
        borderColor: '#000',
    },
    activeDot: {
        backgroundColor: '#00FFFF', // Cyan
        shadowColor: '#00FFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: '#333',
        marginVertical: 4,
    },
    content: {
        flex: 1,
        paddingBottom: Spacing.s,
    },
    time: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginBottom: 4,
    },
    title: {
        color: '#FFF',
        marginBottom: 4,
    },
    activeText: {
        color: '#00FFFF',
    },
    description: {
        color: '#888',
        fontSize: 14,
    }
});
