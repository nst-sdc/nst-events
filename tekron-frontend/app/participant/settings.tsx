import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { Card } from '../../components/Card';
import { usePushNotifications } from '../../hooks/usePushNotifications';

export default function Settings() {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const { expoPushToken } = usePushNotifications();

    const toggleNotifications = () => {
        setNotificationsEnabled(prev => !prev);
        // In a real app, you might want to call an API to disable notifications on the backend
        // or just rely on the OS permission toggle.
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Settings" />

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <Card style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="notifications-outline" size={24} color={PALETTE.primaryBlue} />
                            <View>
                                <Text style={styles.rowTitle}>Push Notifications</Text>
                                <Text style={styles.rowSubtitle}>
                                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: PALETTE.mediumGray, true: PALETTE.primaryBlue }}
                            thumbColor={PALETTE.white}
                        />
                    </View>

                    {expoPushToken && (
                        <View style={styles.debugInfo}>
                            <Text style={styles.debugText}>Token Active</Text>
                        </View>
                    )}
                </Card>

                <Text style={styles.sectionTitle}>About</Text>

                <Card style={styles.card}>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="information-circle-outline" size={24} color={PALETTE.primaryBlue} />
                            <Text style={styles.rowTitle}>Version</Text>
                        </View>
                        <Text style={styles.rowValue}>2.0.0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.row} onPress={() => router.push('/participant/privacy')}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="shield-checkmark-outline" size={24} color={PALETTE.primaryBlue} />
                            <Text style={styles.rowTitle}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={PALETTE.mediumGray} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.row} onPress={() => router.push('/participant/terms')}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="document-text-outline" size={24} color={PALETTE.primaryBlue} />
                            <Text style={styles.rowTitle}>Terms of Service</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={PALETTE.mediumGray} />
                    </TouchableOpacity>
                </Card>
            </View>
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
        marginTop: SPACING.m,
    },
    card: {
        marginBottom: SPACING.l,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    rowTitle: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        fontWeight: '500',
    },
    rowSubtitle: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
    },
    rowValue: {
        ...TYPOGRAPHY.body,
        color: PALETTE.primaryBlue,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: PALETTE.blueLight,
        marginLeft: SPACING.xl + SPACING.m,
    },
    debugInfo: {
        padding: SPACING.s,
        backgroundColor: PALETTE.blueLight,
        alignItems: 'center',
        borderBottomLeftRadius: RADIUS.m,
        borderBottomRightRadius: RADIUS.m,
    },
    debugText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryBlue,
        fontSize: 10,
        fontWeight: 'bold',
    },
});
