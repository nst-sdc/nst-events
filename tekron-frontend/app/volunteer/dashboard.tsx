import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_URL } from '../../constants/config';
import { storage } from '../../utils/storage';

interface Participant {
    id: string;
    name: string;
    email: string;
}

export default function VolunteerDashboard() {
    const { logout, user } = useAuthStore();
    const [event, setEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAssignedEvent();
    }, []);

    const fetchAssignedEvent = async () => {
        try {
            const token = await storage.getItem('token');
            const res = await fetch(`${BACKEND_URL}/volunteer/event`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEvent(data);
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderParticipant = ({ item }: { item: Participant }) => (
        <View style={styles.card}>
            <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
            <TouchableOpacity style={styles.checkInButton}>
                <Text style={styles.checkInText}>Check In</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader
                title="Volunteer Panel"
                rightIcon="log-out-outline"
                onRightPress={logout}
            />

            <View style={styles.content}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={PALETTE.creamLight} />
                ) : event ? (
                    <>
                        <View style={styles.eventHeader}>
                            <Text style={styles.eventTitle}>{event.title}</Text>
                            <Text style={styles.eventLocation}>{event.location}</Text>
                            <Text style={styles.stats}>
                                {event.participants?.length || 0} Attendees Registered
                            </Text>
                        </View>

                        <FlatList
                            data={event.participants}
                            renderItem={renderParticipant}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.list}
                        />
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={64} color={PALETTE.purpleLight} />
                        <Text style={styles.emptyText}>No event assigned to you yet.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        padding: SPACING.m,
    },
    eventHeader: {
        backgroundColor: '#1a1a2e',
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.m,
        borderLeftWidth: 4,
        borderLeftColor: PALETTE.purpleLight,
    },
    eventTitle: {
        ...TYPOGRAPHY.h2,
        color: 'white',
        marginBottom: SPACING.s,
    },
    eventLocation: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        marginBottom: SPACING.s,
    },
    stats: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
    },
    list: {
        paddingBottom: SPACING.xl,
    },
    card: {
        backgroundColor: '#1a1a2e',
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.s,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        ...TYPOGRAPHY.h3,
        color: 'white',
    },
    email: {
        ...TYPOGRAPHY.caption,
        color: '#888',
    },
    checkInButton: {
        backgroundColor: PALETTE.purpleDeep,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.s,
    },
    checkInText: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
        fontSize: 12,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        ...TYPOGRAPHY.h3,
        color: '#888',
        marginTop: SPACING.m,
    },
});
