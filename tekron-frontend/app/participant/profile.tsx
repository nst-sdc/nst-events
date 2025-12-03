import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { useAuthStore } from '../../context/authStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

export default function Profile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/auth/login');
    };

    const qrValue = JSON.stringify({
        id: user?.id || 'unknown',
        email: user?.email || 'unknown',
        role: user?.role || 'participant',
        timestamp: new Date().toISOString(),
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Profile</Text>

            <Card style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.name}>{user?.name || 'Participant'}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                <View style={styles.qrContainer}>
                    <View style={styles.qrPlaceholder}>
                        <QRCode
                            value={qrValue}
                            size={150}
                            color={PALETTE.navyDark}
                            backgroundColor="white"
                        />
                    </View>
                    <Text style={styles.qrLabel}>Your Event Pass</Text>
                </View>
            </Card>

            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingIcon}>
                        <Ionicons name="settings-outline" size={24} color={PALETTE.purpleDeep} />
                    </View>
                    <Text style={styles.settingText}>Settings</Text>
                    <Ionicons name="chevron-forward" size={24} color={PALETTE.purpleMedium} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingIcon}>
                        <Ionicons name="moon-outline" size={24} color={PALETTE.purpleDeep} />
                    </View>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <View style={styles.toggleMock} />
                </TouchableOpacity>
            </View>

            <GradientButton
                title="Logout"
                onPress={handleLogout}
                colors={[PALETTE.purpleDeep, PALETTE.navyDark]}
                style={styles.logoutButton}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.creamLight,
    },
    content: {
        padding: SPACING.l,
        paddingTop: SPACING.xxl,
    },
    headerTitle: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.purpleDeep,
        marginBottom: SPACING.l,
    },
    profileCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        marginBottom: SPACING.xl,
        backgroundColor: PALETTE.creamDark, // Warm soft shade
    },
    avatarContainer: {
        marginBottom: SPACING.m,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: PALETTE.purpleDeep,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: PALETTE.purpleDark,
        marginBottom: SPACING.l,
    },
    qrContainer: {
        alignItems: 'center',
        marginTop: SPACING.m,
        padding: SPACING.m,
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.m,
    },
    qrPlaceholder: {
        marginBottom: SPACING.s,
    },
    qrLabel: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleMedium,
        fontWeight: 'bold',
    },
    settingsContainer: {
        marginBottom: SPACING.xl,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.s,
    },
    settingIcon: {
        marginRight: SPACING.m,
    },
    settingText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.navyDark,
        flex: 1,
        fontWeight: '600',
    },
    toggleMock: {
        width: 40,
        height: 24,
        borderRadius: 12,
        backgroundColor: PALETTE.creamDark,
    },
    logoutButton: {
        marginTop: SPACING.s,
    },
});
