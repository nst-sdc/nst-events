import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../../constants/theme';
import { AppHeader } from '../../../components/AppHeader';
import { BACKEND_URL } from '../../../constants/config';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../../context/authStore';

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
    const router = useRouter();
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
            const token = await SecureStore.getItemAsync('token');
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
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={getCategoryIcon(item.category)} size={20} color={PALETTE.primaryBlue} />
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'CLOSED' && styles.statusClosed]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <Text style={styles.cardLocation}>
                <Ionicons name="location-outline" size={14} color={PALETTE.primaryBlue} /> {item.location}
            </Text>

            {item.description && <Text style={styles.cardDescription}>{item.description}</Text>}

            <View style={styles.cardFooter}>
                <Text style={styles.reporterName}>Reported by {item.reportedBy.name}</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader title="Lost & Found" showBack />

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'LOST' && styles.activeTab]}
                    onPress={() => setActiveTab('LOST')}
                >
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={activeTab === 'LOST' ? PALETTE.primaryBlue : PALETTE.mediumGray}
                        style={{ marginBottom: 4 }}
                    />
                    <Text style={[styles.tabText, activeTab === 'LOST' && styles.activeTabText]}>LOST ITEMS</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'FOUND' && styles.activeTab]}
                    onPress={() => setActiveTab('FOUND')}
                >
                    <Ionicons
                        name="gift-outline"
                        size={20}
                        color={activeTab === 'FOUND' ? PALETTE.primaryBlue : PALETTE.mediumGray}
                        style={{ marginBottom: 4 }}
                    />
                    <Text style={[styles.tabText, activeTab === 'FOUND' && styles.activeTabText]}>FOUND ITEMS</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={PALETTE.primaryBlue} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} items reported yet.</Text>
                    }
                    refreshing={loading}
                    onRefresh={fetchItems}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/participant/lost-found/report')}
            >
                <Ionicons name="add" size={30} color={PALETTE.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    tabs: {
        flexDirection: 'row',
        padding: SPACING.m,
        gap: SPACING.m,
        backgroundColor: PALETTE.white,
        marginBottom: SPACING.s,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.s,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: PALETTE.primaryBlue,
    },
    tabText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.mediumGray,
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: PALETTE.primaryBlue,
    },
    listContent: {
        padding: SPACING.m,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.s,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.m,
        backgroundColor: PALETTE.bgSuperLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    cardTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        fontSize: 16,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.round,
        backgroundColor: PALETTE.blueLight,
        borderWidth: 1,
        borderColor: PALETTE.blueSuperLight,
    },
    statusClosed: {
        backgroundColor: PALETTE.lightGray,
        borderColor: PALETTE.mediumGray,
    },
    statusText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryBlue,
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    cardLocation: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        color: PALETTE.darkGray,
        marginBottom: SPACING.xs,
        marginLeft: 56, // Align with title
    },
    cardDescription: {
        ...TYPOGRAPHY.body,
        color: PALETTE.mediumGray,
        marginBottom: SPACING.m,
        marginLeft: 56, // Align with title
        fontSize: 14,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: PALETTE.bgSuperLight,
        paddingTop: SPACING.s,
        marginTop: SPACING.s,
    },
    reporterName: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        fontWeight: '500',
    },
    date: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
    },
    emptyText: {
        color: PALETTE.mediumGray,
        textAlign: 'center',
        marginTop: SPACING.xl,
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: SPACING.xl,
        right: SPACING.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: PALETTE.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    }
});
