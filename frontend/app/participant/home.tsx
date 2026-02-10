import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../context/authStore';
import { storage } from '../../utils/storage';
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
    const [unreadCount, setUnreadCount] = useState(0);

    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        try {
            setError(null);
            const token = await storage.getItem('token');
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

    const fetchUnreadAlerts = async () => {
        try {
            const token = await storage.getItem('token');
            const lastViewed = await storage.getItem('last_alerts_viewed_at');
            const response = await fetch(`${BACKEND_URL}/participant/alerts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const lastViewedDate = lastViewed ? new Date(lastViewed) : new Date(0);
                    const unread = data.filter((alert: any) => new Date(alert.createdAt) > lastViewedDate).length;
                    setUnreadCount(unread);
                }
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const handleAlertsPress = async () => {
        await storage.setItem('last_alerts_viewed_at', new Date().toISOString());
        setUnreadCount(0);
        router.push('/participant/alerts');
    };

    useEffect(() => {
        fetchEvents();
        fetchUnreadAlerts();

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

    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
                        <TouchableOpacity onPress={handleAlertsPress} style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={24} color={PALETTE.white} />
                            {unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                            <Ionicons name="log-out-outline" size={24} color={PALETTE.white} />
                        </TouchableOpacity>
                    </View>
                </View>

            </LinearGradient>

            <View style={styles.contentContainer}>
                {/* Quick Access - Pinned */}
                <View style={styles.quickAccessContainer}>
                    <Text style={[styles.sectionHeader, { marginBottom: SPACING.m }]}>Quick Access</Text>
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

                <ScrollView
                    contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xl, paddingTop: SPACING.m }}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchEvents} tintColor={PALETTE.primaryBlue} />
                    }
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                >
                    {error && (
                        <View style={{ marginHorizontal: 20, marginBottom: 20, padding: 10, backgroundColor: '#fee2e2', borderRadius: 8, borderWidth: 1, borderColor: '#ef4444' }}>
                            <Text style={{ color: '#b91c1c', textAlign: 'center' }}>{error}</Text>
                        </View>
                    )}

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
                                                <Text style={styles.timelineDate}>{formatDateLabel(event.startTime)}</Text>
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
                                                <Text style={styles.timelineDate}>{formatDateLabel(event.startTime)}</Text>
                                                <Text style={styles.timelineTime}>{formatDate(event.startTime)}</Text>
                                                <View style={[styles.timelineLine, index === upcomingEvents.length - 1 && { height: 0 }]} />
                                                <View style={[styles.timelineDot, { borderColor: PALETTE.mediumGray }]} />
                                            </View>
                                            <TouchableOpacity style={styles.timelineContent} onPress={() => router.push('/participant/map')}>
                                                <View style={[styles.timelineCard, { borderLeftColor: PALETTE.mediumGray }]}>
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
        backgroundColor: '#F8F9FA', // Lighter, cleaner gray
    },
    heroSection: {
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.xl * 1.5,
        zIndex: 1,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Better alignment
        marginBottom: SPACING.l,
    },
    greeting: {
        ...TYPOGRAPHY.body,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    userName: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.white,
        fontSize: 28, // Slightly smaller for elegance
        fontWeight: '700',
    },
    headerActions: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    iconBtn: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: RADIUS.round,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: PALETTE.alertRed,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: PALETTE.primaryBlue, // Matches header background for cutout effect
    },
    badgeText: {
        color: PALETTE.white,
        fontSize: 10,
        fontWeight: 'bold',
    },

    contentContainer: {
        flex: 1,
        marginTop: -SPACING.xl * 1.2, // More overlap
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
        gap: SPACING.xs,
    },
    sectionHeader: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.darkGray, // Darker for better contrast on white
        fontSize: 18,
        fontWeight: '700',
    },

    // Quick Access - Refined
    quickAccessContainer: {
        backgroundColor: PALETTE.white,
        marginHorizontal: SPACING.l,
        padding: SPACING.l,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 6,
        marginBottom: SPACING.xl,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionItem: {
        alignItems: 'center',
        gap: 8,
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
        fontWeight: '600',
        fontSize: 12,
    },

    // Horizontal Scroll
    horizontalScroll: {
        paddingRight: SPACING.l,
    },
    liveCard: {
        width: 180, // Wider for better layout
        height: 110,
        borderRadius: 20,
        padding: SPACING.m,
        marginRight: SPACING.m,
        justifyContent: 'space-between',
        shadowColor: PALETTE.primaryOrange,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    liveCardTitle: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.white,
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    liveCardLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    liveCardLocation: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255,255,255,0.95)',
        fontSize: 11,
        fontWeight: '500',
    },
    liveLabel: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: PALETTE.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    liveLabelText: {
        fontSize: 10,
        fontWeight: '900',
        color: PALETTE.primaryOrange,
        letterSpacing: 0.5,
    },
    liveIndicator: {
        width: 8, // Fixed size
        height: 8,
        borderRadius: 4,
        backgroundColor: PALETTE.alertRed,
    },

    // Tabs - Modern Pill Style
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.l,
        gap: SPACING.s,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    activeTab: {
        backgroundColor: PALETTE.primaryBlue,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    tabText: {
        fontSize: 14,
        color: PALETTE.gray,
        fontWeight: '600',
    },
    activeTabText: {
        color: PALETTE.white,
        fontWeight: '700',
    },

    // Timeline - Cleaner
    timeline: {
        paddingLeft: SPACING.s,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: SPACING.m, // Increased spacing between events
    },
    timelineLeft: {
        alignItems: 'flex-end', // Align right to nicely butt against line
        width: 70, // Increased width for Date + Time
        marginRight: SPACING.m,
        paddingRight: 10,
    },
    timelineDate: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        fontWeight: '700',
        fontSize: 11,
        marginBottom: 2,
    },
    timelineTime: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
        fontWeight: '500',
        fontSize: 11,
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: PALETTE.bgLight,
        borderWidth: 2,
        borderColor: PALETTE.primaryBlue,
        position: 'absolute',
        top: 4, // Align with text top
        right: -5,
        zIndex: 1,
    },
    timelineLine: {
        width: 1, // Thinner
        backgroundColor: '#E5E7EB', // Tailored gray 200 equivalent
        flex: 1,
        marginTop: 0,
        position: 'absolute',
        top: 10,
        right: -1,
        height: '120%', // Extend slightly to connect
    },
    timelineContent: {
        flex: 1,
        paddingBottom: SPACING.s,
    },
    timelineCard: {
        backgroundColor: PALETTE.white,
        borderRadius: 16,
        padding: SPACING.m,
        // No border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 3, // Accent
        borderLeftColor: PALETTE.primaryBlue,
    },
    timelineTitle: {
        ...TYPOGRAPHY.h4,
        color: '#111827', // Gray 900
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
    },
    timelineLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timelineLocation: {
        ...TYPOGRAPHY.caption,
        color: '#6B7280', // Gray 500
        fontSize: 12,
    },
    timelineStatus: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryOrange,
        fontWeight: 'bold',
        marginTop: SPACING.s,
        fontSize: 11,
        letterSpacing: 0.5,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        padding: SPACING.xxl,
        backgroundColor: 'transparent',
        marginTop: SPACING.l,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        marginTop: SPACING.m,
        textAlign: 'center',
        opacity: 0.7,
    },
});
