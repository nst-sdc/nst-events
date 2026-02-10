import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/AppHeader';
import { storage } from '../../utils/storage';

import { BACKEND_URL } from '../../constants/config';

interface Alert {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    senderRole: string;
}

export default function Alerts() {
    const router = useRouter();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            const token = await storage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/participant/alerts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAlerts(data);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Poll every 30 seconds
        const interval = setInterval(fetchAlerts, 30000);
        return () => clearInterval(interval);
    }, []);

    const getAlertIcon = (role: string) => {
        if (role === 'superadmin') return 'warning';
        return 'information-circle';
    };

    const getAlertColor = (role: string) => {
        if (role === 'superadmin') return PALETTE.alertRed;
        return PALETTE.primaryBlue;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Alerts"
                showBack
                onBackPress={() => router.push('/participant/home')}
            />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchAlerts} tintColor={PALETTE.primaryBlue} />
                }
            >
                {alerts.length === 0 && !loading ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={48} color={PALETTE.mediumGray} />
                        <Text style={styles.emptyText}>No alerts at the moment.</Text>
                    </View>
                ) : (
                    alerts.map((alert) => (
                        <Card key={alert.id} style={styles.alertCard}>
                            <View style={styles.alertHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: getAlertColor(alert.senderRole) }]}>
                                    <Ionicons name={getAlertIcon(alert.senderRole)} size={20} color={PALETTE.white} />
                                </View>
                                <View style={styles.headerText}>
                                    <Text style={styles.alertTitle}>{alert.title}</Text>
                                    <Text style={styles.alertTime}>{formatDate(alert.createdAt)}</Text>
                                </View>
                            </View>
                            <Text style={styles.alertMessage}>{alert.message}</Text>
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
        backgroundColor: PALETTE.bgLight,
    },
    content: {
        padding: SPACING.l,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xxl,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.mediumGray,
        marginTop: SPACING.m,
    },
    alertCard: {
        marginBottom: SPACING.m,
        backgroundColor: PALETTE.white,
        borderLeftWidth: 4,
        borderLeftColor: PALETTE.primaryBlue,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    iconContainer: {
        padding: SPACING.xs,
        borderRadius: RADIUS.s,
        marginRight: SPACING.m,
    },
    headerText: {
        flex: 1,
    },
    alertTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        fontSize: 18,
    },
    alertTime: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
    },
    alertMessage: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        lineHeight: 22,
    },
});
