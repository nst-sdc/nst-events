import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import { useAdminStore } from '../../context/adminStore';

export default function AdminDashboard() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const { stats, fetchStats, isLoading } = useAdminStore();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleLogout = async () => {
        await logout();
        router.replace('/auth/login');
    };

    const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: keyof typeof Ionicons.glyphMap, color: string }) => (
        <Card style={styles.statCard}>
            <View style={styles.statHeader}>
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={24} color={PALETTE.white} />
                </View>
                <Text style={styles.statValue}>{value}</Text>
            </View>
            <Text style={styles.statTitle}>{title}</Text>
        </Card>
    );

    const ActionButton = ({ title, icon, onPress, colors }: { title: string, icon: keyof typeof Ionicons.glyphMap, onPress: () => void, colors: readonly [string, string, ...string[]] }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.actionButtonContainer}>
            <LinearGradient
                colors={[...colors]}
                style={styles.actionButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Ionicons name={icon} size={32} color={PALETTE.white} />
                <Text style={styles.actionText}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <AppHeader
                title="Admin Dashboard"
                rightIcon="log-out-outline"
                onRightPress={handleLogout}
            />

            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.l }]}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchStats} tintColor={PALETTE.primaryBlue} />
                }
            >
                <Text style={styles.sectionTitle}>Live Metrics</Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Total Participants"
                        value={stats.totalParticipants}
                        icon="people"
                        color={PALETTE.primaryBlue}
                    />
                    <StatCard
                        title="Pending Approvals"
                        value={stats.pendingApprovals}
                        icon="time"
                        color={PALETTE.alertRed}
                    />
                    <StatCard
                        title="Approved Users"
                        value={stats.approvedUsers}
                        icon="checkmark-circle"
                        color={PALETTE.successGreen}
                    />
                    <StatCard
                        title="Today's Check-ins"
                        value={stats.todayCheckIns}
                        icon="enter"
                        color={PALETTE.primaryMint}
                    />
                </View>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/admin/photos')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: PALETTE.primaryBlue }]}>
                        <Ionicons name="images" size={24} color={PALETTE.white} />
                    </View>
                    <Text style={styles.menuText}>Content Moderation</Text>
                    <Ionicons name="chevron-forward" size={24} color={PALETTE.primaryBlue} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <ActionButton
                        title="Scan QR"
                        icon="qr-code-outline"
                        onPress={() => router.push('/admin/scanner')}
                        colors={GRADIENTS.primary}
                    />
                    <ActionButton
                        title="Send Alert"
                        icon="megaphone-outline"
                        onPress={() => router.push('/admin/alerts')}
                        colors={GRADIENTS.success}
                    />
                </View>
                <View style={[styles.actionsGrid, { marginTop: SPACING.m }]}>
                    <ActionButton
                        title="Manage Events"
                        icon="calendar-outline"
                        onPress={() => router.push('/admin/events')}
                        colors={GRADIENTS.warning}
                    />
                    <ActionButton
                        title="Lost & Found"
                        icon="search-outline"
                        onPress={() => router.push('/admin/lost-found')}
                        colors={GRADIENTS.primary}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    content: {
        padding: SPACING.l,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        marginBottom: SPACING.m,
        marginTop: SPACING.s,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.m,
        marginBottom: SPACING.xl,
    },
    statCard: {
        width: '47%',
        backgroundColor: PALETTE.white,
        padding: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        borderRadius: RADIUS.m,
        shadowColor: PALETTE.primaryBlue,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    iconContainer: {
        padding: SPACING.s,
        borderRadius: RADIUS.s,
    },
    statValue: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.primaryBlue,
        fontSize: 28,
    },
    statTitle: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        fontWeight: 'bold',
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    actionButtonContainer: {
        flex: 1,
        height: 120,
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.m,
    },
    actionText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.white,
        marginTop: SPACING.s,
        textAlign: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        elevation: 2,
    },
    menuText: {
        flex: 1,
        ...TYPOGRAPHY.body,
        color: PALETTE.primaryBlue,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: SPACING.m,
    },
});
