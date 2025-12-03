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
                            <Ionicons name="notifications-outline" size={24} color={PALETTE.creamLight} />
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
                            trackColor={{ false: PALETTE.purpleLight, true: PALETTE.pinkLight }}
                            thumbColor={PALETTE.creamLight}
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
                            <Ionicons name="information-circle-outline" size={24} color={PALETTE.creamLight} />
                            <Text style={styles.rowTitle}>Version</Text>
                        </View>
                        <Text style={styles.rowValue}>2.0.0</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="document-text-outline" size={24} color={PALETTE.creamLight} />
                            <Text style={styles.rowTitle}>Terms of Service</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={PALETTE.purpleLight} />
                    </TouchableOpacity>
                </Card>
            </View>
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
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.purpleLight,
        marginBottom: SPACING.m,
        marginTop: SPACING.m,
    },
    card: {
        backgroundColor: PALETTE.purpleDeep,
        padding: 0,
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
        color: PALETTE.pinkLight,
    },
    rowSubtitle: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
    },
    rowValue: {
        ...TYPOGRAPHY.body,
        color: PALETTE.purpleLight,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: SPACING.xl + SPACING.m,
    },
    debugInfo: {
        padding: SPACING.s,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
    },
    debugText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.pinkLight,
        fontSize: 10,
    },
});
