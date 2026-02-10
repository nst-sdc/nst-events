import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, GRADIENTS } from '../../constants/theme';
import { storage } from '../../utils/storage';
import { BACKEND_URL } from '../../constants/config';

interface LostFoundItem {
    id: string;
    type: 'LOST' | 'FOUND';
    title: string;
    imageUrl?: string;
    description: string;
    location: string;
    category: string;
    status: 'OPEN' | 'CLAIMED' | 'CLOSED';
    createdAt: string;
    isApproved?: boolean;
    reportedBy: {
        name: string;
    };
}

export default function AdminLostFound() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL'>('PENDING');

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = await storage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/lost-found?type=`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            Alert.alert('Error', 'Failed to fetch items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const updateStatus = async (id: string, status?: string, isApproved?: boolean) => {
        try {
            const token = await storage.getItem('token');
            const body: any = {};
            if (status) body.status = status;
            if (isApproved !== undefined) body.isApproved = isApproved;

            const response = await fetch(`${BACKEND_URL}/lost-found/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                Alert.alert('Success', 'Item updated successfully');
                fetchItems();
            } else {
                Alert.alert('Error', 'Failed to update item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
            Alert.alert('Error', 'Failed to update item');
        }
    };

    const sortedItems = items.filter(item => {
        if (activeTab === 'PENDING') return item.isApproved === false;
        return true;
    });

    const renderItem = ({ item }: { item: LostFoundItem }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <View style={[styles.typeBadge, item.type === 'LOST' ? styles.badgeLost : styles.badgeFound]}>
                        <Ionicons
                            name={item.type === 'LOST' ? "search" : "gift"}
                            size={12}
                            color={item.type === 'LOST' ? PALETTE.primaryOrange : PALETTE.primaryBlue}
                        />
                        <Text style={[styles.typeText, item.type === 'LOST' ? styles.textLost : styles.textFound]}>
                            {item.type}
                        </Text>
                    </View>
                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, item.isApproved ? styles.statusApproved : styles.statusPending]}>
                    <Text style={[styles.statusText, item.isApproved ? styles.statusTextApproved : styles.statusTextPending]}>
                        {item.isApproved ? 'APPROVED' : 'PENDING'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={item.category === 'ELECTRONICS' ? "phone-portrait-outline" : "cube-outline"}
                        size={24}
                        color={PALETTE.gray}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle}>
                        <Ionicons name="location-sharp" size={12} color={PALETTE.gray} /> {item.location}
                    </Text>
                </View>
            </View>

            {item.description ? (
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            ) : null}

            {item.imageUrl && (
                <TouchableOpacity style={styles.imageBtn}>
                    <Text style={styles.imageBtnText}>View Image</Text>
                </TouchableOpacity>
            )}

            <View style={styles.divider} />

            <View style={styles.actions}>
                {!item.isApproved ? (
                    <>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.rejectBtn]}
                            onPress={() => updateStatus(item.id, undefined, false)}
                        >
                            <Text style={styles.rejectBtnText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.approveBtn]}
                            onPress={() => updateStatus(item.id, 'OPEN', true)}
                        >
                            <Text style={styles.approveBtnText}>Approve</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.closeBtn]}
                        onPress={() => updateStatus(item.id, 'CLOSED', true)}
                        disabled={item.status === 'CLOSED'}
                    >
                        <Text style={[styles.closeBtnText, item.status === 'CLOSED' && { color: PALETTE.gray }]}>
                            {item.status === 'CLOSED' ? 'Case Closed' : 'Close Case'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={GRADIENTS.header}
                style={[styles.headerGradient, { paddingTop: insets.top }]}
            >
                <View style={styles.headerContentWrapper}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={PALETTE.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Lost & Found Manager</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.tabContainer}>
                    <View style={styles.tabWrapper}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'PENDING' && styles.activeTab]}
                            onPress={() => setActiveTab('PENDING')}
                        >
                            <Text style={[styles.tabText, activeTab === 'PENDING' && styles.activeTabText]}>PENDING REVIEW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'ALL' && styles.activeTab]}
                            onPress={() => setActiveTab('ALL')}
                        >
                            <Text style={[styles.tabText, activeTab === 'ALL' && styles.activeTabText]}>ALL ITEMS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={PALETTE.primaryBlue} />
                    </View>
                ) : (
                    <FlatList
                        data={sortedItems}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="checkmark-circle-outline" size={64} color={PALETTE.lightGray} />
                                <Text style={styles.emptyTitle}>All caught up!</Text>
                                <Text style={styles.emptySubtitle}>
                                    No {activeTab.toLowerCase()} items to display.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgSuperLight,
    },
    headerGradient: {
        paddingBottom: SPACING.xl,
        borderBottomLeftRadius: RADIUS.xl,
        borderBottomRightRadius: RADIUS.xl,
        ...SHADOWS.medium,
        zIndex: 1,
    },
    headerContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    backButton: {
        padding: SPACING.s,
    },
    tabContainer: {
        paddingHorizontal: SPACING.l,
        marginTop: SPACING.s,
    },
    tabWrapper: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: RADIUS.l,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.s,
        alignItems: 'center',
        borderRadius: RADIUS.m,
    },
    activeTab: {
        backgroundColor: PALETTE.white,
        ...SHADOWS.small,
    },
    tabText: {
        ...TYPOGRAPHY.h4,
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    activeTabText: {
        color: PALETTE.primaryBlue,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        marginTop: -SPACING.l,
    },
    listContent: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: SPACING.xl,
    },
    card: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.small,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
        gap: 4,
    },
    badgeLost: {
        backgroundColor: PALETTE.orangeLight,
    },
    badgeFound: {
        backgroundColor: PALETTE.blueLight,
    },
    typeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    textLost: {
        color: PALETTE.primaryOrange,
    },
    textFound: {
        color: PALETTE.primaryBlue,
    },
    date: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
    },
    statusApproved: {
        backgroundColor: PALETTE.mintLight,
    },
    statusPending: {
        backgroundColor: PALETTE.orangeLight,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusTextApproved: {
        color: PALETTE.mintDark,
    },
    statusTextPending: {
        color: PALETTE.orangeDark,
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: PALETTE.bgSuperLight,
        borderRadius: RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.navyDark,
        fontWeight: 'bold',
    },
    itemSubtitle: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
    },
    description: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        color: PALETTE.darkGray,
        marginBottom: SPACING.m,
        lineHeight: 20,
    },
    imageBtn: {
        alignSelf: 'flex-start',
        marginBottom: SPACING.m,
    },
    imageBtnText: {
        color: PALETTE.primaryBlue,
        fontWeight: '600',
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: PALETTE.bgSuperLight,
        marginBottom: SPACING.m,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: SPACING.m,
    },
    actionBtn: {
        paddingHorizontal: SPACING.l,
        paddingVertical: 8,
        borderRadius: RADIUS.m,
        minWidth: 80,
        alignItems: 'center',
    },
    approveBtn: {
        backgroundColor: PALETTE.primaryBlue,
    },
    approveBtnText: {
        color: PALETTE.white,
        fontWeight: '600',
        fontSize: 12,
    },
    rejectBtn: {
        backgroundColor: PALETTE.white,
        borderWidth: 1,
        borderColor: PALETTE.alertRed,
    },
    rejectBtnText: {
        color: PALETTE.alertRed,
        fontWeight: '600',
        fontSize: 12,
    },
    closeBtn: {
        backgroundColor: PALETTE.bgSuperLight,
    },
    closeBtnText: {
        color: PALETTE.darkGray,
        fontWeight: '600',
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xl * 2,
    },
    emptyTitle: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.darkGray,
        marginTop: SPACING.m,
    },
    emptySubtitle: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        marginTop: SPACING.s,
    },
});
