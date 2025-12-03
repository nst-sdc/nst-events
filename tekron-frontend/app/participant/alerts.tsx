import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Card } from '../../components/Card';

interface Alert {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'warning' | 'urgent';
}

export default function Alerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock polling for alerts
        const fetchAlerts = () => {
            // Simulate API call
            setTimeout(() => {
                setAlerts([
                    {
                        id: '1',
                        title: 'Session Starting Soon',
                        message: 'Keynote speech begins in 15 minutes at the Main Auditorium.',
                        time: '10:45 AM',
                        type: 'urgent',
                    },
                    {
                        id: '2',
                        title: 'Lunch Break',
                        message: 'Lunch will be served at the cafeteria on the ground floor.',
                        time: '12:30 PM',
                        type: 'info',
                    },
                    {
                        id: '3',
                        title: 'Workshop Rescheduled',
                        message: 'The AI Workshop has been moved to Room 302.',
                        time: '02:00 PM',
                        type: 'warning',
                    },
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const renderItem = ({ item }: { item: Alert }) => {
        let accentColor = PALETTE.purpleMedium;
        if (item.type === 'urgent') accentColor = PALETTE.pinkDark;
        if (item.type === 'warning') accentColor = PALETTE.creamDark;

        return (
            <Card style={[styles.card, { borderLeftColor: accentColor }]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                </View>
                <Text style={styles.cardMessage}>{item.message}</Text>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PALETTE.purpleMedium} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Alerts</Text>
            <FlatList
                data={alerts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.creamLight,
        paddingTop: SPACING.xxl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.creamLight,
    },
    headerTitle: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.purpleDeep,
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.m,
    },
    listContent: {
        padding: SPACING.l,
    },
    card: {
        marginBottom: SPACING.m,
        borderLeftWidth: 4,
        backgroundColor: '#FFFFFF', // Clean white for alerts to stand out against cream bg
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    cardTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.purpleDark,
        fontSize: 18,
    },
    cardTime: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleMedium,
        fontWeight: 'bold',
    },
    cardMessage: {
        ...TYPOGRAPHY.body,
        color: PALETTE.navyDark,
    },
});
