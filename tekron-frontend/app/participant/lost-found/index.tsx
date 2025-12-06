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
                        <Ionicons name={getCategoryIcon(item.category)} size={20} color={PALETTE.navyDark} />
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'CLOSED' && styles.statusClosed]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <Text style={styles.cardLocation}>
                <Ionicons name="location-outline" size={14} color={PALETTE.purpleLight} /> {item.location}
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
                        color={activeTab === 'LOST' ? PALETTE.pinkLight : PALETTE.purpleLight}
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
                        color={activeTab === 'FOUND' ? PALETTE.pinkLight : PALETTE.purpleLight}
                        style={{ marginBottom: 4 }}
                    />
                    <Text style={[styles.tabText, activeTab === 'FOUND' && styles.activeTabText]}>FOUND ITEMS</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={PALETTE.purpleLight} style={{ marginTop: 20 }} />
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
                <Ionicons name="add" size={30} color={PALETTE.navyDark} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.navyDark,
    },
    tabs: {
        flexDirection: 'row',
        padding: SPACING.m,
        gap: SPACING.m,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.s,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: PALETTE.pinkLight,
    },
    tabText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.purpleLight,
        fontSize: 14,
    },
    activeTabText: {
        color: PALETTE.pinkLight,
    },
    listContent: {
        padding: SPACING.m,
    },
    card: {
        backgroundColor: PALETTE.purpleDeep,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.purpleMedium,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.xs,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: PALETTE.pinkLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    cardTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        flex: 1,
    },
    statusBadge: {
        backgroundColor: PALETTE.purpleLight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
    },
    statusClosed: {
        backgroundColor: '#555',
    },
    statusText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.navyDark,
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardLocation: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
        marginBottom: SPACING.s,
    },
    cardDescription: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamDark,
        marginBottom: SPACING.m,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: SPACING.s,
    },
    reporterName: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
    },
    date: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
    },
    emptyText: {
        color: PALETTE.creamDark,
        textAlign: 'center',
        marginTop: SPACING.xl,
    },
    fab: {
        position: 'absolute',
        bottom: SPACING.xl,
        right: SPACING.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: PALETTE.pinkLight,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    }
});
