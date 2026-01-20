import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
    status: 'OPEN' | 'CLAIMED' | 'CLOSED';
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

    const markAsClosed = async (id: string) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${BACKEND_URL}/lost-found/${id}/claim`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                Alert.alert('Success', 'Item marked as closed/claimed');
                fetchItems();
            } else {
                Alert.alert('Error', 'Failed to update item');
            }
        } catch (error) {
            console.error('Error closing item:', error);
            Alert.alert('Error', 'Failed to update item');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let color = PALETTE.mediumGray;
        if (status === 'OPEN') color = PALETTE.primaryMint;
        if (status === 'CLOSED') color = PALETTE.darkGray;
        if (status === 'CLAIMED') color = PALETTE.blueMedium;

        return (
            <View style={[styles.badge, { backgroundColor: color }]}>
                <Text style={styles.badgeText}>{status}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Lost & Found Manager" showBack />

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={PALETTE.white} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {items.length === 0 ? (
                        <Text style={styles.emptyText}>No items reported yet.</Text>
                    ) : (
                        items.map((item) => (
                            <Card key={item.id} style={styles.card}>
                                <View style={styles.header}>
                                    <View style={styles.typeTag}>
                                        <Text style={styles.typeText}>{item.type}</Text>
                                    </View>
                                    <StatusBadge status={item.status} />
                                </View>

                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.info}>Category: {item.category}</Text>
                                <Text style={styles.info}>Location: {item.location}</Text>
                                <Text style={styles.info}>Reported by: {item.reportedBy?.name || 'Unknown'}</Text>
                                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>

                                {item.status === 'OPEN' && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => markAsClosed(item.id)}
                                    >
                                        <Text style={styles.actionButtonText}>Mark as Resolved</Text>
                                    </TouchableOpacity>
                                )}
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
        backgroundColor: PALETTE.blueDark,
    },
    content: {
        padding: SPACING.l,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.mediumGray,
        textAlign: 'center',
        marginTop: SPACING.xl,
    },
    card: {
        marginBottom: SPACING.m,
        backgroundColor: PALETTE.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    typeTag: {
        backgroundColor: PALETTE.blueLight,
        paddingHorizontal: SPACING.s,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
    },
    typeText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    badge: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
    },
    badgeText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.blueDark,
        fontWeight: 'bold',
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.white,
        marginBottom: SPACING.xs,
    },
    info: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        marginBottom: 2,
    },
    date: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        fontStyle: 'italic',
        marginTop: SPACING.s,
    },
    actionButton: {
        marginTop: SPACING.m,
        backgroundColor: PALETTE.alertRed,
        padding: SPACING.s,
        borderRadius: RADIUS.m,
        alignItems: 'center',
    },
    actionButtonText: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.white,
    },
});
