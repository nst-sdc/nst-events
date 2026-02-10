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

    // State
    const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED'>('PENDING');
    const [showSuccess, setShowSuccess] = useState(false);
    const [actionType, setActionType] = useState<'approved' | 'rejected'>('approved');
    const [refreshing, setRefreshing] = useState(false);

    // Parsing params for Detail Mode
    const initialData = params.data ? JSON.parse(params.data as string) : null;

    // Get live data from store
    const liveParticipant = participants.find(p => p.id === (initialData?.id || params.id));
    const participantData = liveParticipant || initialData;

    // Refresh data when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            if (!participantData) {
                fetchStats();
            }
        }, [])
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
            fetchStats();
        }
    };

    const handleReject = async (id: string, isListMode: boolean = false) => {
        await rejectParticipant(id);
        if (!isListMode) {
            setActionType('rejected');
            setShowSuccess(true);
        } else {
            fetchStats();
        }
    };

    const handleClosePopup = () => {
        setShowSuccess(false);
        router.back();
    };

    // --- RENDER: LIST MODE (Tabs for Pending/Approved) ---
    if (!participantData) {
        const filteredParticipants = participants.filter(p =>
            activeTab === 'PENDING' ? !p.approved : p.approved
        );

        const renderParticipantItem = ({ item }: { item: any }) => (
            <TouchableOpacity
                style={styles.participantCard}
                onPress={() => router.push({
                    pathname: '/admin/approval',
                    params: { id: item.id, data: JSON.stringify(item) }
                })}
            >
                <View style={styles.participantRow}>
                    <View style={[styles.avatarContainerSmall, item.approved && { backgroundColor: PALETTE.mintLight }]}>
                        <Text style={[styles.avatarTextSmall, item.approved && { color: PALETTE.primaryMint }]}>
                            {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>{item.name}</Text>
                        <Text style={styles.participantEmail}>{item.email}</Text>

                        {item.approved && item.approvedBy ? (
                            <Text style={styles.approvalInfo}>
                                Approved by {item.approvedBy.name}
                            </Text>
                        ) : (
                            <Text style={styles.participantDate}>
                                {item.events && item.events.length > 0 ? `${item.events.length} Events` : 'No events'}
                            </Text>
                        )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={PALETTE.gray} />
                </View>
            </TouchableOpacity>
        );

        return (
            <View style={styles.container}>
                <AppHeader title="User Managment" showBack />

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'PENDING' && styles.activeTab]}
                        onPress={() => setActiveTab('PENDING')}
                    >
                        <Text style={[styles.tabText, activeTab === 'PENDING' && styles.activeTabText]}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'APPROVED' && styles.activeTab]}
                        onPress={() => setActiveTab('APPROVED')}
                    >
                        <Text style={[styles.tabText, activeTab === 'APPROVED' && styles.activeTabText]}>Approved</Text>
                    </TouchableOpacity>
                </View>

                {isLoading && !refreshing && <Loader visible={true} />}

                <FlatList
                    data={filteredParticipants}
                    renderItem={renderParticipantItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.primaryBlue} />
                    }
                    ListEmptyComponent={
                        !isLoading ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name={activeTab === 'PENDING' ? "checkmark-done-circle-outline" : "people-outline"}
                                    size={64}
                                    color={PALETTE.gray}
                                />
                                <Text style={styles.emptyText}>
                                    {activeTab === 'PENDING' ? "All caught up!" : "No approved users yet"}
                                </Text>
                                <Text style={styles.emptySubText}>
                                    {activeTab === 'PENDING'
                                        ? "No pending approvals found."
                                        : "Approved participants will appear here."}
                                </Text>
                            </View>
                        ) : null
                    }
                />
            </View>
        );
    }

    // --- RENDER: DETAIL MODE (Single Participant Review) ---
    const isApproved = participantData.approved;

    return (
        <View style={styles.container}>
            <AppHeader title="Participant Details" showBack />
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
                        <View style={[styles.avatar, isApproved && { backgroundColor: PALETTE.successGreen }]}>
                            <Text style={styles.avatarText}>
                                {participantData.name ? participantData.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.name}>{participantData.name}</Text>
                    <Text style={styles.email}>{participantData.email}</Text>

                    <View style={[styles.statusBadge, {
                        backgroundColor: isApproved ? PALETTE.mintLight : PALETTE.orangeLight
                    }]}>
                        <Text style={[styles.statusText, {
                            color: isApproved ? PALETTE.mintDark : PALETTE.orangeDark
                        }]}>
                            {isApproved ? 'APPROVED USER' : 'PENDING APPROVAL'}
                        </Text>
                    </View>
                </Card>

                {isApproved && participantData.approvedBy && (
                    <View style={styles.attributionCard}>
                        <Ionicons name="shield-checkmark" size={20} color={PALETTE.primaryMint} />
                        <Text style={styles.attributionText}>
                            Approved by <Text style={{ fontWeight: 'bold' }}>{participantData.approvedBy.name}</Text>
                            {participantData.approvedAt && ` on ${new Date(participantData.approvedAt).toLocaleDateString()}`}
                        </Text>
                    </View>
                )}

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
                </Card>

                {!isApproved ? (
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
                ) : (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.rejectBtn, { marginTop: SPACING.l, backgroundColor: PALETTE.bgSuperLight, borderWidth: 1, borderColor: PALETTE.alertRed }]}
                        onPress={() => handleReject(participantData.id)}
                    >
                        <Ionicons name="ban-outline" size={24} color={PALETTE.alertRed} />
                        <Text style={[styles.btnText, { color: PALETTE.alertRed }]}>Revoke Approval</Text>
                    </TouchableOpacity>
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
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
        gap: SPACING.m,
        marginBottom: SPACING.s,
    },
    tab: {
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderRadius: RADIUS.round,
        backgroundColor: PALETTE.bgSuperLight,
    },
    activeTab: {
        backgroundColor: PALETTE.primaryBlue,
    },
    tabText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: PALETTE.white,
    },
    approvalInfo: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.successGreen,
        marginTop: 2,
    },
    attributionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.mintLight,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.l,
        gap: SPACING.s,
    },
    attributionText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryMint,
        flex: 1,
    }
});
