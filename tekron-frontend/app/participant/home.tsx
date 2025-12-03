import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import * as SecureStore from 'expo-secure-store';

import { BACKEND_URL } from '../../constants/config';

interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
}

export default function ParticipantHome() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${BACKEND_URL}/participant/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.replace('/auth/login');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Dashboard"
                rightIcon="log-out-outline"
                onRightPress={handleLogout}
            />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchEvents} tintColor={PALETTE.creamLight} />
                }
            >
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.userName}>{user?.name || 'Participant'}</Text>
                </View>

                <Card style={styles.statusCard}>
                    <View style={styles.statusRow}>
                        <View style={styles.statusIcon}>
                            <Ionicons name="checkmark-circle" size={24} color={PALETTE.purpleDeep} />
                        </View>
                        <View>
                            <Text style={styles.statusLabel}>Status</Text>
                            <Text style={styles.statusValue}>Checked In & Approved</Text>
                        </View>
                    </View>
                </Card>

                <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>

                {events.length === 0 && !loading ? (
                    <Text style={styles.emptyText}>No events scheduled.</Text>
                ) : (
                    events.map((event) => (
                        <Card key={event.id} style={styles.eventCard}>
                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}>{formatDate(event.startTime)}</Text>
                                <View style={styles.timeLine} />
                                <Text style={styles.timeText}>{formatDate(event.endTime)}</Text>
                            </View>
                            <View style={styles.eventDetails}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventLocation}>
                                    <Ionicons name="location-outline" size={14} color={PALETTE.purpleLight} /> {event.location}
                                </Text>
                                {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
                            </View>
                        </Card>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.navyDark,
    },
    content: {
        padding: SPACING.l,
    },
    greetingContainer: {
        marginBottom: SPACING.l,
    },
    greeting: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.creamDark,
        fontWeight: 'normal',
    },
    userName: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.creamLight,
    },
    statusCard: {
        backgroundColor: PALETTE.creamLight,
        marginBottom: SPACING.xl,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        marginRight: SPACING.m,
    },
    statusLabel: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleDeep,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statusValue: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.purpleDeep,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        marginBottom: SPACING.m,
    },
    eventCard: {
        flexDirection: 'row',
        marginBottom: SPACING.m,
        backgroundColor: PALETTE.purpleDeep,
        padding: 0,
        overflow: 'hidden',
    },
    timeContainer: {
        padding: SPACING.m,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
    },
    timeText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.creamDark,
        fontWeight: 'bold',
    },
    timeLine: {
        height: 20,
        width: 1,
        backgroundColor: PALETTE.purpleLight,
        marginVertical: SPACING.xs,
    },
    eventDetails: {
        flex: 1,
        padding: SPACING.m,
        justifyContent: 'center',
    },
    eventTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        fontSize: 18,
        marginBottom: 4,
    },
    eventLocation: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
        marginBottom: SPACING.s,
    },
    eventDescription: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.creamDark,
    },
    emptyText: {
        color: PALETTE.creamDark,
        textAlign: 'center',
        marginTop: SPACING.l,
    },
});
