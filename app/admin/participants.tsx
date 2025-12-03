import { ParticipantRow } from '@/components/admin/ParticipantRow';
import { Input } from '@/components/ui/Input';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Participant {
    id: string;
    email: string;
    name?: string;
    checked_in: boolean;
    approval_status: string;
}

export default function ParticipantsScreen() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'checked_in' | 'pending'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setParticipants(data);
        }
        setLoading(false);
    };

    const filteredParticipants = participants.filter(p => {
        const matchesSearch = (p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (filter === 'checked_in') return p.checked_in;
        if (filter === 'pending') return !p.checked_in;

        return true;
    });

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Participants', headerBackTitle: 'Back' }} />

            <View style={styles.header}>
                <Input
                    placeholder="Search participants..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    icon="search"
                />

                <View style={styles.filters}>
                    {(['all', 'checked_in', 'pending'] as const).map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, filter === f && styles.activeChip]}
                            onPress={() => setFilter(f)}
                        >
                            <ThemedText style={[styles.filterText, filter === f && styles.activeFilterText]}>
                                {f.replace('_', ' ').toUpperCase()}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredParticipants}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ParticipantRow
                        participant={item}
                        onPress={() => console.log('View participant', item.id)}
                    />
                )}
                contentContainerStyle={styles.list}
                refreshing={loading}
                onRefresh={fetchParticipants}
                ListEmptyComponent={
                    <ThemedText style={styles.emptyText}>No participants found.</ThemedText>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        padding: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    filters: {
        flexDirection: 'row',
        marginTop: Spacing.m,
        gap: Spacing.s,
    },
    filterChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#111',
    },
    activeChip: {
        borderColor: Colors.dark.primary,
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
    },
    filterText: {
        fontSize: 12,
        color: '#888',
    },
    activeFilterText: {
        color: Colors.dark.primary,
        fontWeight: 'bold',
    },
    list: {
        paddingBottom: Spacing.xl,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: Spacing.xl,
        color: '#666',
    }
});
