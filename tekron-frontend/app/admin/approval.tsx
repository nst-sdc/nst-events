import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { Popup } from '../../components/Popup';
import { useAdminStore } from '../../context/adminStore';

export default function Approval() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {
        approveParticipant,
        rejectParticipant,
        isLoading,
        participants,
        fetchStats
    } = useAdminStore();

    // State for local interaction
    const [showSuccess, setShowSuccess] = useState(false);
    const [actionType, setActionType] = useState<'approved' | 'rejected'>('approved');
    const [refreshing, setRefreshing] = useState(false);

    // Parsing params for Detail Mode
    const participantData = params.data ? JSON.parse(params.data as string) : null;

    // Refresh data when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            if (!participantData) {
                fetchStats();
            }
        }, [participantData])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStats();
        setRefreshing(false);
    };

    const handleApprove = async (id: string, isListMode: boolean = false) => {
        await approveParticipant(id);
        if (!isListMode) {
            setActionType('approved');
            setShowSuccess(true);
        } else {
            fetchStats(); // Just refresh list
        }
    };

    const handleReject = async (id: string, isListMode: boolean = false) => {
        await rejectParticipant(id);
        if (!isListMode) {
            setActionType('rejected');
            setShowSuccess(true);
        } else {
            fetchStats(); // Just refresh list
        }
    };

    const handleClosePopup = () => {
        setShowSuccess(false);
        router.back();
    };

    // --- RENDER: LIST MODE (Pending Approvals) ---
    if (!participantData) {
        const pendingParticipants = participants.filter(p => !p.approved);

        const renderParticipantItem = ({ item }: { item: any }) => (
            <TouchableOpacity
                style={styles.participantCard}
                onPress={() => router.push({
                    pathname: '/admin/approval',
                    params: { id: item.id, data: JSON.stringify(item) }
                })}
            >
                <View style={styles.participantRow}>
                    <View style={styles.avatarContainerSmall}>
                        <Text style={styles.avatarTextSmall}>
                            {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>{item.name}</Text>
                        <Text style={styles.participantEmail}>{item.email}</Text>
                        <Text style={styles.participantDate}>
                            {item.events && item.events.length > 0 ? `${item.events.length} Events` : 'No events'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={PALETTE.gray} />
                </View>
            </TouchableOpacity>
        );

        return (
            <View style={styles.container}>
                <AppHeader title="Pending Approvals" showBack />

                {isLoading && !refreshing && <Loader visible={true} />}

                <FlatList
                    data={pendingParticipants}
                    renderItem={renderParticipantItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.primaryBlue} />
                    }
                    ListEmptyComponent={
                        !isLoading ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="checkmark-done-circle-outline" size={64} color={PALETTE.successGreen} />
                                <Text style={styles.emptyText}>All caught up!</Text>
                                <Text style={styles.emptySubText}>No pending approvals found.</Text>
                            </View>
                        ) : null
                    }
                />
            </View>
        );
    }

    // --- RENDER: DETAIL MODE (Single Participant Review) ---
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
                        <Text style={styles.statusText}>{participantData.status ? participantData.status.toUpperCase() : 'UNKNOWN'}</Text>
                    </View>
                </Card>

                <Text style={styles.sectionTitle}>Event Details</Text>
                <Card style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Assigned Events</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            {participantData.events && participantData.events.length > 0 ? (
                                participantData.events.map((e: any, index: number) => (
                                    <Text key={index} style={styles.detailValue}>{e.title}</Text>
                                ))
                            ) : (
                                <Text style={styles.detailValue}>No events found</Text>
                            )}
                        </View>
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

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleReject(participantData.id)}
                    >
                        <Ionicons name="close-circle-outline" size={24} color={PALETTE.white} />
                        <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => handleApprove(participantData.id)}
                    >
                        <Ionicons name="checkmark-circle-outline" size={24} color={PALETTE.white} />
                        <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>
                </View>
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
    listContent: {
        padding: SPACING.m,
        paddingBottom: SPACING.xxl,
    },
    errorText: {
        textAlign: 'center',
        marginTop: SPACING.xl,
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: SPACING.l,
        paddingVertical: SPACING.xl,
    },
    avatarContainer: {
        marginBottom: SPACING.m,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: PALETTE.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.white,
    },
    name: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.navyDark,
        marginBottom: SPACING.xs,
    },
    email: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        marginBottom: SPACING.m,
    },
    statusBadge: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.round,
    },
    statusText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.navyDark,
        marginBottom: SPACING.m,
        marginLeft: SPACING.xs,
    },
    detailsCard: {
        marginBottom: SPACING.l,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: SPACING.s,
    },
    detailLabel: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        width: '40%',
    },
    detailValue: {
        ...TYPOGRAPHY.body,
        color: PALETTE.navyDark,
        fontWeight: '500',
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: PALETTE.lightGray,
        marginVertical: SPACING.s,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginTop: SPACING.m,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        gap: SPACING.s,
    },
    rejectBtn: {
        backgroundColor: PALETTE.alertRed,
    },
    approveBtn: {
        backgroundColor: PALETTE.successGreen,
    },
    btnText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    // List Mode Styles
    participantCard: {
        backgroundColor: PALETTE.white,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.m,
        // Assuming SHADOWS is defined elsewhere or needs to be added
        // ...SHADOWS.small, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    participantRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainerSmall: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: PALETTE.blueLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    avatarTextSmall: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
    },
    participantInfo: {
        flex: 1,
    },
    participantName: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: PALETTE.navyDark,
    },
    participantEmail: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
    },
    participantDate: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryOrange,
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.xxl * 2,
    },
    emptyText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.navyDark,
        marginTop: SPACING.m,
    },
    emptySubText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        marginTop: SPACING.s,
    },
});
