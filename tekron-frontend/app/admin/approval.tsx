import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { Loader } from '../../components/Loader';
import { Popup } from '../../components/Popup';
import { useAdminStore } from '../../context/adminStore';

export default function Approval() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { approveParticipant, rejectParticipant, isLoading } = useAdminStore();
    const [showSuccess, setShowSuccess] = useState(false);
    const [actionType, setActionType] = useState<'approved' | 'rejected'>('approved');

    const participantData = params.data ? JSON.parse(params.data as string) : null;

    if (!participantData) {
        return (
            <View style={styles.container}>
                <AppHeader title="Error" showBack />
                <Text style={styles.errorText}>No participant data found.</Text>
            </View>
        );
    }

    const handleApprove = async () => {
        await approveParticipant(participantData.id);
        setActionType('approved');
        setShowSuccess(true);
    };

    const handleReject = async () => {
        await rejectParticipant(participantData.id);
        setActionType('rejected');
        setShowSuccess(true);
    };

    const handleClosePopup = () => {
        setShowSuccess(false);
        router.back();
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Review Participant" showBack />
            <Loader visible={isLoading} />

            <Popup
                visible={showSuccess}
                title={actionType === 'approved' ? 'Success!' : 'Rejected'}
                message={`Participant has been ${actionType}.`}
                onClose={handleClosePopup}
                type={actionType === 'approved' ? 'success' : 'error'}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <Card style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {participantData.name ? participantData.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.name}>{participantData.name}</Text>
                    <Text style={styles.email}>{participantData.email}</Text>

                    <View style={[styles.statusBadge, { backgroundColor: participantData.status === 'approved' ? PALETTE.purpleMedium : PALETTE.pinkDark }]}>
                        <Text style={styles.statusText}>{participantData.status.toUpperCase()}</Text>
                    </View>
                </Card>

                <Text style={styles.sectionTitle}>Event Details</Text>
                <Card style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Assigned Event</Text>
                        <Text style={styles.detailValue}>Tekron 2.0 Tech Summit</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Role</Text>
                        <Text style={styles.detailValue}>Participant</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Check-in History</Text>
                        <Text style={styles.detailValue}>No prior check-ins</Text>
                    </View>
                </Card>

                <View style={styles.actionsContainer}>
                    <GradientButton
                        title="Approve"
                        onPress={handleApprove}
                        colors={[PALETTE.purpleMedium, PALETTE.purpleDeep]}
                        style={styles.actionButton}
                    />
                    <GradientButton
                        title="Reject"
                        onPress={handleReject}
                        colors={[PALETTE.pinkDark, PALETTE.pinkLight]}
                        style={styles.actionButton}
                    />
                </View>
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
    errorText: {
        color: PALETTE.creamLight,
        textAlign: 'center',
        marginTop: SPACING.xl,
    },
    profileCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        marginBottom: SPACING.l,
        backgroundColor: PALETTE.purpleDeep,
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
        borderColor: PALETTE.pinkLight,
    },
    avatarText: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.creamLight,
    },
    name: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.creamLight,
        marginBottom: SPACING.xs,
    },
    email: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamDark,
        marginBottom: SPACING.m,
    },
    statusBadge: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.m,
        borderRadius: RADIUS.round,
    },
    statusText: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
        fontSize: 12,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        marginBottom: SPACING.m,
    },
    detailsCard: {
        backgroundColor: PALETTE.purpleDeep,
        marginBottom: SPACING.xl,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.s,
    },
    detailLabel: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamDark,
    },
    detailValue: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: SPACING.s,
    },
    actionsContainer: {
        gap: SPACING.m,
    },
    actionButton: {
        width: '100%',
    },
});
