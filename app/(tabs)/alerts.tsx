import { AlertCard, AlertSeverity } from '@/components/alerts/AlertCard';
import { EmergencyBanner } from '@/components/alerts/EmergencyBanner';
import { AnimatedScreen } from '@/components/ui/AnimatedScreen';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Alert {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    created_at: string;
}

export default function AlertsScreen() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
    const { notification } = usePushNotifications(); // Initialize hook

    useEffect(() => {
        fetchAlerts();

        // Real-time subscription
        const subscription = supabase
            .channel('alerts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, payload => {
                const newAlert = payload.new as Alert;
                setAlerts(prev => [newAlert, ...prev]);
                if (newAlert.severity === 'emergency') {
                    setEmergencyAlert(newAlert.message);
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchAlerts = async () => {
        // Mock data for now if table doesn't exist or is empty
        const mockAlerts: Alert[] = [
            { id: '1', title: 'Welcome', message: 'Welcome to Tekron 2.0!', severity: 'info', created_at: new Date().toISOString() },
            { id: '2', title: 'Schedule Update', message: 'Lunch has been moved to 1:30 PM.', severity: 'warning', created_at: new Date(Date.now() - 3600000).toISOString() },
        ];
        setAlerts(mockAlerts);

        // Uncomment when table exists
        /*
        const { data, error } = await supabase
            .from('alerts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (!error && data) {
            setAlerts(data);
        }
        */
    };

    return (
        <AnimatedScreen>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <ThemedText variant="h1" style={styles.title}>ALERTS</ThemedText>
                </View>

                <FlatList
                    data={alerts}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <AlertCard
                            title={item.title}
                            message={item.message}
                            severity={item.severity}
                            timestamp={new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <ThemedText style={styles.emptyText}>No alerts yet.</ThemedText>
                    }
                />

                <EmergencyBanner
                    visible={!!emergencyAlert}
                    message={emergencyAlert || ''}
                />
            </SafeAreaView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        padding: Spacing.l,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        color: Colors.dark.primary, // Cyan
        letterSpacing: 2,
    },
    listContent: {
        padding: Spacing.l,
    },
    emptyText: {
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.xl,
    }
});
