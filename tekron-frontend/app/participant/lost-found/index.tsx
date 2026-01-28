import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, GRADIENTS } from '../../../constants/theme';
import { AppHeader } from '../../../components/AppHeader';
import { BACKEND_URL } from '../../../constants/config';
import { storage } from '../../../utils/storage';
import { useAuthStore } from '../../../context/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LostFoundItem {
    id: string;
    type: 'LOST' | 'FOUND';
    category: string;
    title: string;
    description: string;
    location: string;
    status: string;
    createdAt: string;
    reportedBy: {
        name: string;
    };
}

export default function LostFoundScreen() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'LOST' | 'FOUND'>('LOST');
    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = await storage.getItem('token');
            const res = await fetch(`${BACKEND_URL}/lost-found?type=${activeTab}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'ELECTRONICS': return 'phone-portrait-outline';
            case 'CLOTHING': return 'shirt-outline';
            case 'ACCESSORIES': return 'glasses-outline';
            case 'DOCUMENTS': return 'document-text-outline';
            default: return 'help-circle-outline';
        }
    };

    const renderItem = ({ item }: { item: LostFoundItem }) => (
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={() => {
                // Future: Navigate to detail view
            }}
        >
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconWrapper}>
                        <LinearGradient
                            colors={item.type === 'LOST' ? [PALETTE.orangeLight, PALETTE.white] : [PALETTE.mintLight, PALETTE.white]}
                            style={styles.iconGradient}
                        >
                            <Ionicons
                                name={getCategoryIcon(item.category)}
                                size={22}
                                color={item.type === 'LOST' ? PALETTE.primaryOrange : PALETTE.primaryMint}
                            />
                        </LinearGradient>
                    </View>
                    <View style={styles.headerContent}>
                        <View style={styles.titleRow}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                            <View style={[
                                styles.statusBadge,
                                item.status === 'CLOSED' ? styles.statusClosed : styles.statusOpen
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    item.status === 'CLOSED' ? styles.statusTextClosed : styles.statusTextOpen
                                ]}>{item.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.cardLocation} numberOfLines={1}>
                            <Ionicons name="location-sharp" size={12} color={PALETTE.gray} /> {item.location}
                        </Text>
                    </View>
                </View>

                {item.description ? (
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                ) : null}

                <View style={styles.cardFooter}>
                    <View style={styles.reporterInfo}>
                        <Ionicons name="person-circle-outline" size={16} color={PALETTE.gray} />
                        <Text style={styles.reporterName}>{item.reportedBy.name}</Text>
                    </View>
                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
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
                    <Text style={styles.headerTitle}>Lost & Found</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/participant/lost-found/report')}
                    >
                        <Ionicons name="add" size={24} color={PALETTE.primaryBlue} />
                    </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                    <View style={styles.tabWrapper}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'LOST' && styles.activeTab]}
                            onPress={() => setActiveTab('LOST')}
                        >
                            <Text style={[styles.tabText, activeTab === 'LOST' && styles.activeTabText]}>LOST ITEMS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'FOUND' && styles.activeTab]}
                            onPress={() => setActiveTab('FOUND')}
                        >
                            <Text style={[styles.tabText, activeTab === 'FOUND' && styles.activeTabText]}>FOUND ITEMS</Text>
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
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons
                                    name={activeTab === 'LOST' ? "search" : "gift-outline"}
                                    size={64}
                                    color={PALETTE.lightGray}
                                />
                                <Text style={styles.emptyTitle}>
                                    No {activeTab.toLowerCase()} items
                                </Text>
                                <Text style={styles.emptySubtitle}>
                                    {activeTab === 'LOST'
                                        ? "Great news! Nothing is currently reported missing."
                                        : "No found items reported yet."}
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
    addButton: {
        backgroundColor: PALETTE.white,
        padding: SPACING.s,
        borderRadius: RADIUS.round,
        ...SHADOWS.small,
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
    cardContainer: {
        marginBottom: SPACING.m,
        ...SHADOWS.small,
    },
    card: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: SPACING.s,
    },
    iconWrapper: {
        marginRight: SPACING.m,
    },
    iconGradient: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.darkGray,
        flex: 1,
        marginRight: SPACING.s,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
    },
    statusOpen: {
        backgroundColor: PALETTE.mintLight,
    },
    statusClosed: {
        backgroundColor: PALETTE.lightGray,
    },
    statusText: {
        ...TYPOGRAPHY.caption,
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusTextOpen: {
        color: PALETTE.mintDark,
    },
    statusTextClosed: {
        color: PALETTE.gray,
    },
    cardLocation: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
    },
    cardDescription: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        color: PALETTE.gray,
        marginBottom: SPACING.m,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SPACING.s,
        borderTopWidth: 1,
        borderTopColor: PALETTE.bgSuperLight,
    },
    reporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reporterName: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
        marginLeft: 6,
    },
    date: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xl * 2,
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.l,
        marginTop: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
        borderStyle: 'dashed',
    },
    emptyTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.darkGray,
        marginTop: SPACING.m,
    },
    emptySubtitle: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        textAlign: 'center',
        marginTop: SPACING.s,
        paddingHorizontal: SPACING.xl,
    },
});
