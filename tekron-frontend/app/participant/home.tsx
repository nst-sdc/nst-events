import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../context/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ParticipantHome() {
    const { user } = useAuthStore();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.name}>{user?.name || 'Participant'}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Approved</Text>
                </View>
            </View>

            <Card style={styles.eventCard}>
                <LinearGradient
                    colors={GRADIENTS.primary}
                    style={styles.eventGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.eventLabel}>CURRENT EVENT</Text>
                    <Text style={styles.eventName}>Tekron 2.0 Tech Summit</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={20} color={PALETTE.creamLight} />
                        <Text style={styles.eventLocation}>MCA Building, 4th Floor</Text>
                    </View>
                </LinearGradient>
            </Card>

            <Text style={styles.sectionTitle}>Schedule</Text>

            <View style={styles.scheduleContainer}>
                <Card style={styles.scheduleCard}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>10:00 AM</Text>
                        <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.scheduleDetails}>
                        <Text style={styles.scheduleTitle}>Opening Ceremony</Text>
                        <Text style={styles.scheduleDesc}>Main Auditorium</Text>
                    </View>
                </Card>

                <Card style={styles.scheduleCard}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>11:30 AM</Text>
                        <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.scheduleDetails}>
                        <Text style={styles.scheduleTitle}>Keynote Speech</Text>
                        <Text style={styles.scheduleDesc}>Future of AI in Tech</Text>
                    </View>
                </Card>

                <Card style={styles.scheduleCard}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>01:00 PM</Text>
                        <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.scheduleDetails}>
                        <Text style={styles.scheduleTitle}>Lunch Break</Text>
                        <Text style={styles.scheduleDesc}>Cafeteria</Text>
                    </View>
                </Card>
            </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.l,
    },
    greeting: {
        ...TYPOGRAPHY.body,
        color: PALETTE.purpleMedium,
    },
    name: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.purpleDeep,
    },
    statusBadge: {
        backgroundColor: PALETTE.purpleLight,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.m,
        borderRadius: RADIUS.round,
    },
    statusText: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
        fontSize: 12,
    },
    eventCard: {
        padding: 0, // Remove default padding to let gradient fill
        overflow: 'hidden',
        marginBottom: SPACING.xl,
        height: 180,
    },
    eventGradient: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'center',
    },
    eventLabel: {
        color: PALETTE.pinkLight,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
        letterSpacing: 1,
    },
    eventName: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.creamLight,
        marginBottom: SPACING.s,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    eventLocation: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamDark,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.navyDark,
        marginBottom: SPACING.m,
    },
    scheduleContainer: {
        gap: SPACING.m,
    },
    scheduleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.l,
    },
    timeContainer: {
        width: 80,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: PALETTE.purpleLight,
        paddingRight: SPACING.m,
    },
    time: {
        fontWeight: 'bold',
        color: PALETTE.purpleDeep,
    },
    timelineLine: {
        // Visual element could be added here
    },
    scheduleDetails: {
        flex: 1,
        paddingLeft: SPACING.m,
    },
    scheduleTitle: {
        ...TYPOGRAPHY.h3,
        fontSize: 16,
        color: PALETTE.navyDark,
        marginBottom: 2,
    },
    scheduleDesc: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleMedium,
    },
});
