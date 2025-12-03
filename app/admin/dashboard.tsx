import { StatCard } from '@/components/admin/StatCard';
import { AnimatedScreen } from '@/components/ui/AnimatedScreen';
import { Button } from '@/components/ui/Button';
import { CheckInSuccess } from '@/components/ui/CheckInSuccess';
import { QRScanner } from '@/components/ui/QRScanner';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export default function AdminDashboard() {
    const { signOut } = useAuthStore();
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [checkInDetails, setCheckInDetails] = useState({ name: '', location: '' });
    const [stats, setStats] = useState({ checkedIn: 0, pending: 0 });

    useEffect(() => {
        fetchStats();

        // Subscribe to changes for live updates
        const subscription = supabase
            .channel('users_stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchStats)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchStats = async () => {
        const { count: checkedInCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('checked_in', true);

        const { count: totalCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        setStats({
            checkedIn: checkedInCount || 0,
            pending: (totalCount || 0) - (checkedInCount || 0)
        });
    };

    const handleScan = async (data: string) => {
        setIsScanning(false);
        try {
            const userId = data;
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (userError || !user) {
                Alert.alert('Error', 'User not found or invalid QR code.');
                return;
            }

            if (user.checked_in) {
                Alert.alert('Already Checked In', `${user.name || 'User'} is already checked in.`);
                return;
            }

            const assignedLocation = "Main Hall - Floor 1";

            const { error: updateError } = await supabase
                .from('users')
                .update({
                    checked_in: true,
                    approval_status: 'approved',
                })
                .eq('id', userId);

            if (updateError) throw updateError;

            setCheckInDetails({
                name: user.name || user.email || 'Participant',
                location: assignedLocation
            });
            setShowSuccess(true);
            fetchStats(); // Update stats immediately

        } catch (error: any) {
            console.error('Check-in error:', error);
            Alert.alert('Check-in Failed', error.message);
        }
    };

    if (isScanning) {
        return (
            <QRScanner
                onScan={handleScan}
                onClose={() => setIsScanning(false)}
            />
        );
    }

    return (
        <AnimatedScreen>
            <View style={styles.container}>
                <ThemedText variant="h1" style={styles.title}>Admin Dashboard</ThemedText>
                <ThemedText variant="body" style={styles.subtitle}>Manage events and participants</ThemedText>

                <View style={styles.statsContainer}>
                    <StatCard value={stats.checkedIn} label="Checked In" />
                    <StatCard value={stats.pending} label="Pending" />
                </View>

                <View style={styles.actions}>
                    <Button
                        label="Scan QR Code"
                        onPress={() => setIsScanning(true)}
                        variant="glow"
                        icon="qr-code-outline"
                    />

                    <Button
                        label="Manage Participants"
                        onPress={() => router.push('/admin/participants' as any)}
                        variant="pixel"
                        icon="people-outline"
                    />

                    <Button
                        label="Broadcast Announcement"
                        onPress={() => router.push('/admin/announcements' as any)}
                        variant="pixel"
                        icon="megaphone-outline"
                    />
                </View>

                <Button
                    label="Sign Out"
                    onPress={signOut}
                    variant="outline"
                    style={styles.signOutButton}
                />

                <CheckInSuccess
                    visible={showSuccess}
                    onClose={() => setShowSuccess(false)}
                    participantName={checkInDetails.name}
                    location={checkInDetails.location}
                />
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        padding: Spacing.l,
    },
    title: {
        color: '#FF00FF', // Neon Purple
        marginBottom: Spacing.m,
        textAlign: 'center',
    },
    subtitle: {
        color: Colors.dark.textSecondary,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: Spacing.xl,
    },
    actions: {
        width: '100%',
        gap: Spacing.m,
        marginBottom: Spacing.xl,
    },
    signOutButton: {
        width: '100%',
        borderColor: '#FF00FF',
        marginTop: 'auto', // Push to bottom if space allows
    }
});

