import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../../constants/theme';
import { Card } from '../../components/Card';
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
    const insets = useSafeAreaInsets();

    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        try {
            setError(null);
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${BACKEND_URL}/participant/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setEvents(data);
                    setLiveEvents(data.filter((e: Event) => e.status === 'LIVE'));
                } else {
                    setError('Invalid data received from server');
                }
            } else if (response.status === 403) {
                setError('Your account is waiting for approval. Events will be visible once approved.');
            } else {
                setError(`Failed to load events: ${response.status}`);
            }
        } catch (error: any) {
            console.error('[Home] Error fetching events:', error);
            setError(`Network Error: ${error.message}`);
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

    const getGreeting = () => {
        const options = { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false } as const;
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const hour = parseInt(formatter.format(new Date()));

        if (hour >= 5 && hour < 12) return 'Good Morning,';
        if (hour >= 12 && hour < 17) return 'Good Afternoon,';
        if (hour >= 17 && hour < 21) return 'Good Evening,';
        return 'Good Night,';
    };

    const [greeting, setGreeting] = useState(getGreeting());

    useEffect(() => {
        const interval = setInterval(() => {
            setGreeting(getGreeting());
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const [activeTab, setActiveTab] = useState<'TODAY' | 'UPCOMING'>('TODAY');

    // Event Filtering Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const todayEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === today.getTime();
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() > today.getTime();
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const formatUpcomingDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[...GRADIENTS.header]}
                style={[styles.heroSection, { paddingTop: insets.top + SPACING.l }]}
            >
                <View style={styles.heroHeader}>
                    <View>
                        <Text style={styles.greeting}>{greeting}</Text>
                        <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Participant'}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => router.push('/participant/alerts')} style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={24} color={PALETTE.white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                            <Ionicons name="log-out-outline" size={24} color={PALETTE.white} />
                        </TouchableOpacity>
                    </View>
                </View>

            </LinearGradient>

            <View style={styles.contentContainer}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xl }}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchEvents} tintColor={PALETTE.primaryBlue} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {error && (
                        <View style={{ margin: 20, padding: 10, backgroundColor: '#fee2e2', borderRadius: 8, borderWidth: 1, borderColor: '#ef4444' }}>
                            <Text style={{ color: '#b91c1c', textAlign: 'center' }}>{error}</Text>
                        </View>
                    )}
                    {/* Quick Access Grid */}
                    <View style={styles.quickAccessContainer}>
                        <Text style={styles.sectionHeader}>Quick Access</Text>
                        <View style={styles.actionGrid}>
                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/participant/profile')}>
                                <View style={[styles.actionIcon, { backgroundColor: PALETTE.blueLight }]}>
                                    <Ionicons name="person" size={24} color={PALETTE.primaryBlue} />
                                </View>
                                <Text style={styles.actionLabel}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/participant/map')}>
                                <View style={[styles.actionIcon, { backgroundColor: PALETTE.mintLight }]}>
                                    <Ionicons name="map" size={24} color={PALETTE.primaryMint} />
                                </View>
                                <Text style={styles.actionLabel}>Map</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/participant/lost-found')}>
                                <View style={[styles.actionIcon, { backgroundColor: PALETTE.orangeLight }]}>
                                    <Ionicons name="search" size={24} color={PALETTE.primaryOrange} />
                                </View>
                                <Text style={styles.actionLabel}>Lost</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/participant/gallery')}>
                                <View style={[styles.actionIcon, { backgroundColor: PALETTE.lightGray }]}>
                                    <Ionicons name="images" size={24} color={PALETTE.darkGray} />
                                </View>
                                <Text style={styles.actionLabel}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Live Events Carousel */}
                    {liveEvents.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionHeader}>Live Now</Text>
                                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                    <View style={styles.liveIndicator} />
                                </Animated.View>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                                {liveEvents.map((event) => (
                                    <LinearGradient
                                        key={event.id}
                                        colors={[PALETTE.primaryOrange, PALETTE.orangeDark]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.liveCard}
                                    >
                                        <Text style={styles.liveCardTitle} numberOfLines={1}>{event.title}</Text>
                                        <View style={styles.liveCardLocationRow}>
                                            <Ionicons name="location" size={12} color={PALETTE.white} />
                                            <Text style={styles.liveCardLocation} numberOfLines={1}>{event.location}</Text>
                                        </View>
                                        <View style={styles.liveLabel}>
                                            <Text style={styles.liveLabelText}>LIVE</Text>
                                        </View>
                                    </LinearGradient>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Schedule Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'TODAY' && styles.activeTab]}
                            onPress={() => setActiveTab('TODAY')}
                        >
                            <Text style={[styles.tabText, activeTab === 'TODAY' && styles.activeTabText]}>Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'UPCOMING' && styles.activeTab]}
                            onPress={() => setActiveTab('UPCOMING')}
                        >
                            <Text style={[styles.tabText, activeTab === 'UPCOMING' && styles.activeTabText]}>Upcoming</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Today's Timeline */}
                    {activeTab === 'TODAY' && (
                        <View style={styles.section}>
                            {todayEvents.length === 0 && !loading ? (
                                <View style={styles.emptyState}>
                                    <Ionicons name="calendar-outline" size={48} color={PALETTE.mediumGray} />
                                    <Text style={styles.emptyText}>No events scheduled for today.</Text>
                                </View>
                            ) : (
                                <View style={styles.timeline}>
                                    {todayEvents.map((event, index) => (
                                        <View key={event.id} style={styles.timelineItem}>
                                            <View style={styles.timelineLeft}>
                                                <Text style={styles.timelineTime}>{formatDate(event.startTime)}</Text>
                                                <View style={[styles.timelineLine, index === todayEvents.length - 1 && { height: 0 }]} />
                                                <View style={styles.timelineDot} />
                                            </View>
                                            <TouchableOpacity style={styles.timelineContent} onPress={() => router.push('/participant/map')}>
                                                <View style={styles.timelineCard}>
                                                    <Text style={styles.timelineTitle}>{event.title}</Text>
                                                    <View style={styles.timelineLocationRow}>
                                                        <Ionicons name="location-outline" size={14} color={PALETTE.primaryBlue} />
                                                        <Text style={styles.timelineLocation}>{event.location}</Text>
                                                    </View>
                                                    {event.status === 'LIVE' && (
                                                        <Text style={styles.timelineStatus}>Happening Now</Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Upcoming Schedule */}
                    {activeTab === 'UPCOMING' && (
                        <View style={styles.section}>
                            {upcomingEvents.length === 0 && !loading ? (
                                <View style={styles.emptyState}>
                                    <Ionicons name="calendar-sharp" size={48} color={PALETTE.mediumGray} />
                                    <Text style={styles.emptyText}>No upcoming events found.</Text>
                                </View>
                            ) : (
                                <View style={styles.timeline}>
                                    {upcomingEvents.map((event, index) => (
                                        <View key={event.id} style={styles.timelineItem}>
                                            <View style={styles.timelineLeft}>
                                                <Text style={[styles.timelineTime, { fontSize: 10, marginBottom: 2 }]}>{formatUpcomingDate(event.startTime)}</Text>
                                                <Text style={styles.timelineTime}>{formatDate(event.startTime)}</Text>
                                                <View style={[styles.timelineLine, index === upcomingEvents.length - 1 && { height: 0 }]} />
                                                <View style={[styles.timelineDot, { borderColor: PALETTE.darkGray }]} />
                                            </View>
                                            <TouchableOpacity style={styles.timelineContent} onPress={() => router.push('/participant/map')}>
                                                <View style={[styles.timelineCard, { borderColor: PALETTE.lightGray }]}>
                                                    <Text style={styles.timelineTitle}>{event.title}</Text>
                                                    <View style={styles.timelineLocationRow}>
                                                        <Ionicons name="location-outline" size={14} color={PALETTE.gray} />
                                                        <Text style={[styles.timelineLocation, { color: PALETTE.gray }]}>{event.location}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    heroSection: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.xl + SPACING.m,
        zIndex: 1,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.l,
    },
    greeting: {
        ...TYPOGRAPHY.body,
        color: PALETTE.blueLight,
        fontSize: 16,
    },
    userName: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.white,
        fontSize: 32,
    },
    headerActions: {
        flexDirection: 'row',
        gap: SPACING.s,
    },
    iconBtn: {
        padding: SPACING.s,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: RADIUS.round,
    },

    contentContainer: {
        flex: 1,
        marginTop: -SPACING.xl,
        zIndex: 2,
    },
    section: {
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.xl,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
        gap: SPACING.s,
    },
    sectionHeader: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        marginBottom: SPACING.m,
    },
    quickAccessContainer: {
        backgroundColor: PALETTE.white,
        marginHorizontal: SPACING.l,
        padding: SPACING.l,
        borderRadius: RADIUS.l,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: SPACING.xl,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionItem: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        fontWeight: '500',
    },
    horizontalScroll: {
        paddingRight: SPACING.l,
    },
    liveCard: {
        width: 160,
        height: 100,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        marginRight: SPACING.m,
        justifyContent: 'flex-end',
        shadowColor: PALETTE.primaryOrange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    liveCardTitle: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.white,
        fontSize: 16,
        marginBottom: 4,
    },
    liveCardLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    liveCardLocation: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.9)',
    },
    liveLabel: {
        position: 'absolute',
        top: SPACING.m,
        right: SPACING.m,
        backgroundColor: PALETTE.white,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
    },
    liveLabelText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: PALETTE.primaryOrange,
    },
    liveIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: PALETTE.alertRed,
    },
    timeline: {
        paddingLeft: SPACING.m,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    timelineLeft: {
        alignItems: 'center',
        width: 60,
        marginRight: SPACING.m,
    },
    timelineTime: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryBlue,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: PALETTE.white,
        borderWidth: 2,
        borderColor: PALETTE.primaryBlue,
        position: 'absolute',
        top: 20,
        right: -5,
        zIndex: 1,
    },
    timelineLine: {
        width: 2,
        backgroundColor: PALETTE.blueLight,
        flex: 1,
        marginTop: SPACING.s,
        position: 'absolute',
        top: 24,
        right: -1,
        height: '100%',
    },
    timelineContent: {
        flex: 1,
        paddingBottom: SPACING.l,
    },
    timelineCard: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    timelineTitle: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.darkGray,
        fontSize: 16,
        marginBottom: 4,
    },
    timelineLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timelineLocation: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryBlue,
    },
    timelineStatus: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryOrange,
        fontWeight: 'bold',
        marginTop: SPACING.s,
    },
    emptyState: {
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
        borderStyle: 'dashed',
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.mediumGray,
        marginTop: SPACING.m,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.m,
        gap: SPACING.m,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: RADIUS.round,
        backgroundColor: PALETTE.bgSuperLight,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
    },
    activeTab: {
        backgroundColor: PALETTE.primaryBlue,
        borderColor: PALETTE.primaryBlue,
    },
    tabText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: PALETTE.white,
    },
});
