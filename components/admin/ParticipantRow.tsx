import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Participant {
    id: string;
    email: string;
    name?: string;
    checked_in: boolean;
    approval_status: string;
}

interface ParticipantRowProps {
    participant: Participant;
    onPress: () => void;
}

export function ParticipantRow({ participant, onPress }: ParticipantRowProps) {
    const isCheckedIn = participant.checked_in;
    const statusColor = isCheckedIn ? Colors.dark.success : Colors.dark.warning;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.info}>
                <ThemedText variant="body" style={styles.name}>
                    {participant.name || participant.email.split('@')[0]}
                </ThemedText>
                <ThemedText variant="caption" style={styles.email}>
                    {participant.email}
                </ThemedText>
            </View>

            <View style={[styles.statusBadge, { borderColor: statusColor }]}>
                <Ionicons
                    name={isCheckedIn ? "checkmark-circle" : "time"}
                    size={14}
                    color={statusColor}
                />
                <ThemedText style={[styles.statusText, { color: statusColor }]}>
                    {isCheckedIn ? "IN" : "PENDING"}
                </ThemedText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.m,
        backgroundColor: '#111',
        marginBottom: 1, // Separator effect
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    info: {
        flex: 1,
    },
    name: {
        color: '#FFF',
        marginBottom: 2,
    },
    email: {
        color: '#888',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.s,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        gap: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    }
});
