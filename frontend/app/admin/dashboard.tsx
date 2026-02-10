import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../../constants/theme';
import { useAuthStore } from '../../context/authStore';
import { useAdminStore } from '../../context/adminStore';

export default function AdminDashboard() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { stats, fetchStats, isLoading } = useAdminStore();
    const insets = useSafeAreaInsets();

    // Animation for Live Indicator
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

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

    const getGreeting = () => {
        const options = { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false } as const;
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const hour = parseInt(formatter.format(new Date()));

        if (hour >= 5 && hour < 12) return 'Good Morning,';
        if (hour >= 12 && hour < 17) return 'Good Afternoon,';
        if (hour >= 17 && hour < 21) return 'Good Evening,';
        return 'Good Night,';
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[...GRADIENTS.header]}
                style={[styles.heroSection, { paddingTop: insets.top + SPACING.l }]}
            >
                <View style={styles.heroHeader}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.userName}>{user?.name || 'Administrator'}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => router.push('/admin/alerts')} style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={24} color={PALETTE.white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                            <Ionicons name="log-out-outline" size={24} color={PALETTE.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* System Overview Header on Gradient */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={[styles.sectionHeader, { color: PALETTE.white }]}>System Overview</Text>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <View style={styles.liveIndicator} />
                    </Animated.View>
                </View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 0 }}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchStats} tintColor={PALETTE.primaryBlue} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {/* Live Overview - Professional Stats Cards in 2x2 Grid */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statsGrid}>
                            {/* First Row */}
                            <View style={styles.statsRow}>
                                <View style={styles.statCard}>
                                    <View style={[styles.statIconContainer, { backgroundColor: PALETTE.blueLight }]}>
                                        <Ionicons name="people" size={24} color={PALETTE.primaryBlue} />
                                    </View>
                                    <View style={styles.statContent}>
                                        <Text style={styles.statValue}>{stats.totalParticipants}</Text>
                                        <Text style={styles.statTitle}>Participants</Text>
                                    </View>
                                </View>

                                <View style={styles.statCard}>
                                    <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                                        <Ionicons name="time" size={24} color="#FF9800" />
                                    </View>
                                    <View style={styles.statContent}>
                                        <Text style={styles.statValue}>{stats.pendingApprovals}</Text>
                                        <Text style={styles.statTitle}>Pending</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Second Row */}
                            <View style={styles.statsRow}>
                                <View style={styles.statCard}>
                                    <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                                        <Ionicons name="checkmark-circle" size={24} color={PALETTE.successGreen} />
                                    </View>
                                    <View style={styles.statContent}>
                                        <Text style={styles.statValue}>{stats.approvedUsers}</Text>
                                        <Text style={styles.statTitle}>Approved</Text>
                                    </View>
                                </View>

                                <View style={styles.statCard}>
                                    <View style={[styles.statIconContainer, { backgroundColor: PALETTE.mintLight }]}>
                                        <Ionicons name="enter" size={24} color={PALETTE.primaryMint} />
                                    </View>
                                    <View style={styles.statContent}>
                                        <Text style={styles.statValue}>{stats.todayCheckIns}</Text>
                                        <Text style={styles.statTitle}>Check-ins</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Quick Access Grid - White Floating Card Style */}
                    <View style={styles.quickAccessContainer}>
                        <Text style={styles.sectionHeader}>Quick Actions</Text>
                        <View style={styles.actionGrid}>
                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/admin/approval')}>
                                <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                                    <Ionicons name="shield-checkmark" size={26} color="#FF9800" />
                                </View>
                                <Text style={styles.actionLabel}>Approvals</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/admin/scanner')}>
                                <View style={[styles.actionIcon, { backgroundColor: PALETTE.blueLight }]}>
                                    <Ionicons name="qr-code" size={26} color={PALETTE.primaryBlue} />
                                </View>
                                <Text style={styles.actionLabel}>Scanner</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/admin/events')}>
                                <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                                    <Ionicons name="calendar" size={26} color={PALETTE.successGreen} />
                                </View>
                                <Text style={styles.actionLabel}>Event Manager</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/admin/photos')}>
                                <View style={[styles.actionIcon, { backgroundColor: '#FCE4EC' }]}>
                                    <Ionicons name="images" size={26} color={PALETTE.pinkDark} />
                                </View>
                                <Text style={styles.actionLabel}>Content Upload</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/admin/lost-found')}>
                                <View style={[styles.actionIcon, { backgroundColor: PALETTE.mintLight }]}>
                                    <Ionicons name="search" size={26} color={PALETTE.primaryMint} />
                                </View>
                                <Text style={styles.actionLabel}>Lost/Found</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/admin/alerts')}>
                                <View style={[styles.actionIcon, { backgroundColor: PALETTE.purpleLight }]}>
                                    <Ionicons name="notifications" size={26} color={PALETTE.purpleMedium} />
                                </View>
                                <Text style={styles.actionLabel}>Alerts</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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
        marginTop: -(SPACING.xl + SPACING.l),
        zIndex: 2,
    },
    // Stats Container - Overlapping white card
    statsContainer: {
        backgroundColor: PALETTE.white,
        marginHorizontal: SPACING.l,
        padding: SPACING.m,
        borderRadius: RADIUS.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: SPACING.s,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
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
        color: PALETTE.navyDark,
    },
    liveIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: PALETTE.successGreen,
    },
    // Stats Grid - Perfect 2x2 Layout
    statsGrid: {
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginBottom: SPACING.xs,
    },
    statCard: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PALETTE.bgSuperLight,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        minHeight: 75,
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    statContent: {
        alignItems: 'center',
    },
    statValue: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.navyDark,
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statTitle: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        fontSize: 11,
        fontWeight: '500',
    },
    quickAccessContainer: {
        backgroundColor: PALETTE.white,
        marginHorizontal: SPACING.l,
        padding: SPACING.m,
        borderRadius: RADIUS.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: SPACING.m,
    },
    actionItem: {
        width: '48%',
        alignItems: 'center',
        padding: SPACING.m,
        backgroundColor: PALETTE.bgSuperLight,
        borderRadius: RADIUS.m,
        gap: SPACING.s,
    },
    actionIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        fontWeight: '600',
        fontSize: 12,
    },
});
