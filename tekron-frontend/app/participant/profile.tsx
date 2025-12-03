import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import * as SecureStore from 'expo-secure-store';
import { XPBar } from '../../components/XPBar';
import { BadgeGrid } from '../../components/BadgeGrid';
import { usePushNotifications } from '../../hooks/usePushNotifications';

import { BACKEND_URL } from '../../constants/config';

export default function Profile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [xpData, setXpData] = useState({ xp: 0, level: 1, progress: 0, nextLevelXp: 100 });
    const [badges, setBadges] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Initialize push notifications
    usePushNotifications();

    const fetchData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch QR
            const qrRes = await fetch(`${BACKEND_URL}/participant/qr`, { headers });
            if (qrRes.ok) {
                const data = await qrRes.json();
                setQrCodeData(data.qrCode);
            }

            // Fetch XP
            const xpRes = await fetch(`${BACKEND_URL}/participant/xp`, { headers });
            if (xpRes.ok) {
                const data = await xpRes.json();
                setXpData(data);
            }

            // Fetch Badges
            const badgesRes = await fetch(`${BACKEND_URL}/participant/badges`, { headers });
            if (badgesRes.ok) {
                const data = await badgesRes.json();
                setBadges(data);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/auth/login');
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Profile" />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.creamLight} />}
            >
                <Card style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>

                    <View style={{ width: '100%', marginBottom: SPACING.l }}>
                        <XPBar
                            xp={xpData.xp}
                            level={xpData.level}
                            progress={xpData.progress}
                            nextLevelXp={xpData.nextLevelXp}
                        />
                    </View>

                    <View style={styles.qrContainer}>
                        {qrCodeData ? (
                            <QRCode
                                value={qrCodeData}
                                size={180}
                                backgroundColor="white"
                                color="black"
                            />
                        ) : (
                            <View style={styles.qrPlaceholder}>
                                <Text style={styles.qrPlaceholderText}>Loading QR...</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.qrLabel}>Scan at reception</Text>
                </Card>

                <BadgeGrid badges={badges} />

                <Text style={styles.sectionTitle}>Settings</Text>

                <Card style={styles.settingsCard}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="moon-outline" size={24} color={PALETTE.creamLight} />
                            <Text style={styles.settingText}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            trackColor={{ false: PALETTE.purpleLight, true: PALETTE.purpleMedium }}
                            thumbColor={PALETTE.creamLight}
                        />
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/participant/settings')}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="settings-outline" size={24} color={PALETTE.creamLight} />
                            <Text style={styles.settingText}>App Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={PALETTE.purpleLight} />
                    </TouchableOpacity>
                </Card>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color={PALETTE.pinkLight} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
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
    profileCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        marginBottom: SPACING.xl,
        backgroundColor: PALETTE.creamDark,
    },
    avatarContainer: {
        marginBottom: SPACING.m,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: PALETTE.navyDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: PALETTE.purpleDeep,
    },
    avatarText: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.creamLight,
    },
    name: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.navyDark,
        marginBottom: SPACING.xs,
    },
    email: {
        ...TYPOGRAPHY.body,
        color: PALETTE.purpleDeep,
        marginBottom: SPACING.l,
    },
    qrContainer: {
        padding: SPACING.m,
        backgroundColor: 'white',
        borderRadius: RADIUS.m,
        marginBottom: SPACING.s,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    qrPlaceholder: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrPlaceholderText: {
        color: PALETTE.navyDark,
    },
    qrLabel: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleDeep,
        opacity: 0.7,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        marginBottom: SPACING.m,
    },
    settingsCard: {
        backgroundColor: PALETTE.purpleDeep,
        marginBottom: SPACING.xl,
        padding: 0,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    settingText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: SPACING.xl + SPACING.m,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.s,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.pinkLight,
        marginBottom: SPACING.xl,
    },
    logoutText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.pinkLight,
        fontWeight: 'bold',
    },
});
