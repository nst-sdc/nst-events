import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/AppHeader';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '../../constants/config';

interface LostFoundItem {
    id: string;
    type: 'LOST' | 'FOUND';
    title: string;
    description: string;
    location: string;
    category: string;
    status: 'PENDING' | 'OPEN' | 'CLAIMED' | 'CLOSED';
    imageUrl?: string;
    createdAt: string;
    reportedBy: {
        name: string;
    };
}

export default function AdminLostFound() {
    const router = useRouter();
    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            // Fetch ALL items using admin scope
            const response = await fetch(`${BACKEND_URL}/lost-found?scope=admin`, {
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

    const updateStatus = async (id: string, status: 'OPEN' | 'CLOSED') => {
        if (!id) {
            Alert.alert('Error', 'Invalid Item ID');
            return;
        }

        console.log(`[updateStatus] Updating item ${id} to ${status}`);

        try {
            const token = await SecureStore.getItemAsync('token');
            const url = `${BACKEND_URL}/lost-found/${id}/status`;

            console.log(`[updateStatus] Requesting: ${url}`);

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            console.log(`[updateStatus] Response Status: ${response.status}`);

            if (response.ok) {
                Alert.alert('Success', `Item ${status === 'OPEN' ? 'Approved' : 'Resolved'}`);
                fetchItems();
            } else {
                let errorMessage = 'Failed to update item status';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    console.error('[updateStatus] Error data:', errorData);
                } catch (jsonError) {
                    console.error('[updateStatus] Failed to parse error response as JSON');
                    errorMessage = `Server Error: ${response.status}`;
                }
                Alert.alert('Error', errorMessage);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Failed to update item status. Network or Server Error.');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let color = PALETTE.mediumGray;
        let bgColor = PALETTE.lightGray;
        let label = status;

        if (status === 'OPEN') {
            color = PALETTE.successGreen;
            bgColor = PALETTE.mintLight;
            label = 'VISIBLE';
        }
        if (status === 'CLOSED') {
            color = PALETTE.darkGray;
            bgColor = PALETTE.lightGray;
            label = 'RESOLVED';
        }
        if (status === 'PENDING') {
            color = PALETTE.primaryOrange;
            bgColor = PALETTE.orangeLight;
            label = 'PENDING APPROVAL';
        }

        return (
            <View style={[styles.badge, { backgroundColor: bgColor }]}>
                <Text style={[styles.badgeText, { color }]}>{label}</Text>
            </View>
        );
    };

    const renderActionButtons = (item: LostFoundItem) => {
        if (item.status === 'CLOSED') return null;

        return (
            <View style={styles.actionRow}>
                {item.status === 'PENDING' && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.approveBtn]}
                        onPress={() => updateStatus(item.id, 'OPEN')}
                    >
                        <Ionicons name="checkmark-circle-outline" size={20} color={PALETTE.white} />
                        <Text style={styles.actionButtonText}>Approve & Publish</Text>
                    </TouchableOpacity>
                )}

                {item.status === 'OPEN' && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.resolveBtn]}
                        onPress={() => updateStatus(item.id, 'CLOSED')}
                    >
                        <Ionicons name="archive-outline" size={20} color={PALETTE.white} />
                        <Text style={styles.actionButtonText}>Mark Resolved</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Lost & Found Manager" showBack />

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={PALETTE.primaryBlue} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {items.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="file-tray-outline" size={64} color={PALETTE.mediumGray} />
                            <Text style={styles.emptyText}>No items to manage.</Text>
                        </View>
                    ) : (
                        items.map((item) => (
                            <Card key={item.id} style={styles.card}>
                                <View style={styles.header}>
                                    <View style={[styles.typeTag, item.type === 'FOUND' ? styles.foundTag : styles.lostTag]}>
                                        <Text style={[styles.typeText, item.type === 'FOUND' ? styles.foundText : styles.lostText]}>
                                            {item.type}
                                        </Text>
                                    </View>
                                    <StatusBadge status={item.status} />
                                </View>

                                {item.imageUrl && (
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={styles.itemImage}
                                        resizeMode="cover"
                                    />
                                )}

                                <Text style={styles.title}>{item.title}</Text>

                                <View style={styles.infoRow}>
                                    <Ionicons name="pricetag-outline" size={16} color={PALETTE.mediumGray} />
                                    <Text style={styles.info}>{item.category}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Ionicons name="location-outline" size={16} color={PALETTE.mediumGray} />
                                    <Text style={styles.info}>{item.location}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Ionicons name="person-outline" size={16} color={PALETTE.mediumGray} />
                                    <Text style={styles.info}>Reported by: {item.reportedBy?.name || 'Unknown'}</Text>
                                </View>

                                {item.description ? (
                                    <Text style={styles.description}>"{item.description}"</Text>
                                ) : null}

                                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>

                                {renderActionButtons(item)}
                            </Card>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight, // Light theme background
    },
    content: {
        padding: SPACING.l,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.xxl,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.mediumGray,
        textAlign: 'center',
        marginTop: SPACING.m,
    },
    card: {
        marginBottom: SPACING.m,
        backgroundColor: PALETTE.white,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        shadowColor: PALETTE.primaryBlue,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    typeTag: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
        borderWidth: 1,
    },
    lostTag: {
        backgroundColor: PALETTE.white,
        borderColor: PALETTE.primaryBlue,
    },
    foundTag: {
        backgroundColor: PALETTE.white,
        borderColor: PALETTE.primaryMint, // Or successGreen
    },
    typeText: {
        ...TYPOGRAPHY.caption,
        fontWeight: 'bold',
        fontSize: 10,
    },
    lostText: {
        color: PALETTE.primaryBlue,
    },
    foundText: {
        color: PALETTE.primaryMint,
    },
    badge: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
    },
    badgeText: {
        ...TYPOGRAPHY.caption,
        fontWeight: 'bold',
        fontSize: 10,
    },
    itemImage: {
        width: '100%',
        height: 180,
        borderRadius: RADIUS.s,
        marginBottom: SPACING.m,
        backgroundColor: PALETTE.bgSuperLight,
    },
    title: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.blueDark, // Or primaryBlue
        marginBottom: SPACING.s,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: 4,
    },
    info: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
    },
    description: {
        ...TYPOGRAPHY.body,
        color: PALETTE.mediumGray,
        fontStyle: 'italic',
        marginTop: SPACING.s,
        fontSize: 13,
    },
    date: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray || '#999',
        marginTop: SPACING.s,
        fontSize: 10,
    },
    actionRow: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginTop: SPACING.m,
        borderTopWidth: 1,
        borderTopColor: PALETTE.blueLight, // Or very light gray
        paddingTop: SPACING.m,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.s,
        borderRadius: RADIUS.s,
        gap: SPACING.xs,
    },
    approveBtn: {
        backgroundColor: PALETTE.primaryBlue,
    },
    resolveBtn: {
        backgroundColor: PALETTE.darkGray, // Or mediumGray
    },
    actionButtonText: {
        ...TYPOGRAPHY.h4, // Compact button text
        fontSize: 13,
        color: PALETTE.white,
    },
});
