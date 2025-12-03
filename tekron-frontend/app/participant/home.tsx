import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import * as SecureStore from 'expo-secure-store';
import { socket } from '../../context/socket';

import { BACKEND_URL } from '../../constants/config';

interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    status: 'UPCOMING' | 'LIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
}

export default function ParticipantHome() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [liveEvents, setLiveEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [pulseAnim] = useState(new Animated.Value(1));

    const fetchEvents = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${BACKEND_URL}/participant/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
                setLiveEvents(data.filter((e: Event) => e.status === 'LIVE'));
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();

        socket.on('eventStatusUpdated', (updatedEvent: Event) => {
            setEvents((prevEvents) => {
                const newEvents = prevEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
                setLiveEvents(newEvents.filter((e) => e.status === 'LIVE'));
                return newEvents;
            });
        });

        return () => {
            socket.off('eventStatusUpdated');
        };
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

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

                <View style={styles.xpSummary}>
                    <View style={styles.xpRow}>
                        <View style={styles.xpBadge}>
                            <Text style={styles.xpBadgeText}>LVL {user?.level || 1}</Text>
                        </View>
                        <Text style={styles.xpText}>{user?.xp || 0} XP</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/participant/profile')}>
                        <Text style={styles.viewProfileText}>View Profile &gt;</Text>
                    </TouchableOpacity>
                </View>

                {liveEvents.length > 0 && (
                    <View style={styles.liveSection}>
                        <View style={styles.liveHeader}>
                            <Animated.View style={[styles.liveBadge, { transform: [{ scale: pulseAnim }] }]}>
                                <View style={styles.liveDot} />
                            </Animated.View>
                            <Text style={styles.liveTitle}>LIVE NOW</Text>
                        </View>
                        {liveEvents.map((event) => (
                            <Card key={event.id} style={styles.liveCard}>
                                <View style={styles.liveCardContent}>
                                    <Text style={styles.liveEventTitle}>{event.title}</Text>
                                    <Text style={styles.liveEventLocation}>
                                        <Ionicons name="location" size={14} color={PALETTE.creamLight} /> {event.location}
                                    </Text>
                                </View>
                            </Card>
                        ))}
                    </View>
                )}

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
                                <TouchableOpacity onPress={() => router.push('/participant/map')}>
                                    <Text style={styles.eventLocation}>
                                        <Ionicons name="location-outline" size={14} color={PALETTE.purpleLight} /> {event.location}
                                    </Text>
                                </TouchableOpacity>
                                {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
                                {event.status === 'LIVE' && (
                                    <View style={styles.liveTag}>
                                        <Text style={styles.liveTagText}>LIVE</Text>
                                    </View>
                                )}
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
    liveSection: {
        marginBottom: SPACING.xl,
    },
    liveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    liveBadge: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: PALETTE.pinkLight,
        marginRight: SPACING.s,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'white',
    },
    liveTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.pinkLight,
        letterSpacing: 1,
    },
    liveCard: {
        backgroundColor: PALETTE.pinkMedium,
        marginBottom: SPACING.s,
        borderWidth: 1,
        borderColor: PALETTE.pinkLight,
    },
    liveCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    liveEventTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
    },
    liveEventLocation: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.creamLight,
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
    liveTag: {
        position: 'absolute',
        top: SPACING.s,
        right: SPACING.s,
        backgroundColor: PALETTE.pinkLight,
        paddingHorizontal: SPACING.xs,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
    },
    liveTagText: {
        color: PALETTE.navyDark,
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyText: {
        color: PALETTE.creamDark,
        textAlign: 'center',
        marginTop: SPACING.l,
    },
    xpSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: PALETTE.purpleDeep,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: PALETTE.purpleMedium,
    },
    xpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    xpBadge: {
        backgroundColor: PALETTE.pinkLight,
        paddingHorizontal: SPACING.s,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
    },
    xpBadgeText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.navyDark,
        fontWeight: 'bold',
    },
    xpText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
    viewProfileText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
    },
});
