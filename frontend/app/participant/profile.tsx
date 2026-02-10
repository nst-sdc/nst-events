import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { BACKEND_URL } from '../../constants/config';
import { storage } from '../../utils/storage';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';

export default function Profile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Initialize push notifications
    usePushNotifications();

    const fetchData = async () => {
        try {
            const token = await storage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch QR
            const qrRes = await fetch(`${BACKEND_URL}/participant/qr`, { headers });
            if (qrRes.ok) {
                const data = await qrRes.json();
                setQrCodeData(data.qrCode);
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
            <AppHeader title="Profile" showBack />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.primaryBlue} />}
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



                    <View style={styles.qrContainer}>
                        {qrCodeData ? (
                            <QRCodeDisplay
                                value={qrCodeData}
                                size={180}
                            />
                        ) : (
                            <View style={styles.qrPlaceholder}>
                                <Text style={styles.qrPlaceholderText}>Loading QR...</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.qrLabel}>Scan at reception</Text>
                </Card>



                <Text style={styles.sectionTitle}>Settings</Text>

                <Card style={styles.settingsCard}>
                    <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/participant/settings')}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="settings-outline" size={24} color={PALETTE.primaryBlue} />
                            <Text style={styles.settingText}>App Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={PALETTE.primaryBlue} />
                    </TouchableOpacity>
                </Card>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color={PALETTE.alertRed} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
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
    profileCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        marginBottom: SPACING.xl,
        backgroundColor: PALETTE.white,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
    },
    avatarContainer: {
        marginBottom: SPACING.m,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: PALETTE.blueLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: PALETTE.primaryBlue,
    },
    avatarText: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.primaryBlue,
    },
    name: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.primaryBlue,
        marginBottom: SPACING.xs,
    },
    email: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        marginBottom: SPACING.l,
    },
    qrContainer: {
        padding: SPACING.m,
        backgroundColor: 'white',
        borderRadius: RADIUS.m,
        marginBottom: SPACING.s,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
    },
    qrPlaceholder: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrPlaceholderText: {
        color: PALETTE.primaryBlue,
    },
    qrLabel: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        opacity: 0.7,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        marginBottom: SPACING.m,
    },
    settingsCard: {
        backgroundColor: PALETTE.white,
        marginBottom: SPACING.xl,
        padding: 0,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
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
        color: PALETTE.primaryBlue,
    },
    divider: {
        height: 1,
        backgroundColor: PALETTE.blueLight,
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
        borderColor: PALETTE.alertRed,
        marginBottom: SPACING.xl,
    },
    logoutText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.alertRed,
        fontWeight: 'bold',
    },
});
