import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import { Popup } from '../../components/Popup';
import { storage } from '../../utils/storage';
import { BACKEND_URL } from '../../constants/config';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

interface Photo {
    id: string;
    url: string;
    caption?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    uploader: {
        name: string;
    };
}

export default function PhotoModeration() {
    const router = useRouter();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
    const [popup, setPopup] = useState<{ visible: boolean; title: string; message: string; type: 'success' | 'error' }>({
        visible: false,
        title: '',
        message: '',
        type: 'success'
    });

    useEffect(() => {
        fetchPhotos();
    }, [activeTab]);

    const fetchPhotos = async () => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            const res = await fetch(`${BACKEND_URL}/photos/admin?status=${activeTab}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const res = await fetch(`${BACKEND_URL}/photos/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Remove from current list if tab doesn't match new status
                setPhotos(prev => prev.filter(p => p.id !== id));
                setPopup({
                    visible: true,
                    title: 'Success',
                    message: `Photo marked as ${status}`,
                    type: 'success'
                });
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            setPopup({
                visible: true,
                title: 'Error',
                message: 'Could not update status',
                type: 'error'
            });
        }
    };

    const renderItem = ({ item }: { item: Photo }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.url }} style={styles.image} resizeMode="cover" />
            <View style={styles.infoContainer}>
                <Text style={styles.uploader}>By {item.uploader.name}</Text>
                {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
            </View>
            <View style={styles.actions}>
                {activeTab !== 'APPROVED' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => updateStatus(item.id, 'APPROVED')}
                    >
                        <Ionicons name="checkmark" size={20} color="white" />
                        <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>
                )}
                {activeTab !== 'REJECTED' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => updateStatus(item.id, 'REJECTED')}
                    >
                        <Ionicons name="close" size={20} color="white" />
                        <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                )}
                {/* Allow moving back to pending if needed, mainly for accidentally approved/rejected */}
                {activeTab !== 'PENDING' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.pendingBtn]}
                        onPress={() => updateStatus(item.id, 'PENDING')}
                    >
                        <Ionicons name="time" size={20} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader title="Photo Moderation" showBack />

            <View style={styles.tabs}>
                {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <Loader visible={true} />
            ) : (
                <FlatList
                    data={photos}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No photos in this category.</Text>
                    }
                />
            )}

            <Popup
                visible={popup.visible}
                title={popup.title}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup(prev => ({ ...prev, visible: false }))}
            />
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
        padding: SPACING.s,
        backgroundColor: PALETTE.bgSuperLight,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.s,
        alignItems: 'center',
        borderRadius: RADIUS.s,
    },
    activeTab: {
        backgroundColor: PALETTE.primaryBlue,
    },
    tabText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: PALETTE.white,
    },
    list: {
        padding: SPACING.m,
    },
    card: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.m, // Ensure spacing between cards
        ...SHADOWS.medium,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
    },
    infoContainer: {
        padding: SPACING.m,
    },
    uploader: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        fontWeight: 'bold',
    },
    caption: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        marginTop: SPACING.xs,
    },
    actions: {
        flexDirection: 'row',
        padding: SPACING.s,
        borderTopWidth: 1,
        borderTopColor: PALETTE.lightGray,
        justifyContent: 'flex-end',
        gap: SPACING.s,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.m,
        borderRadius: RADIUS.s,
    },
    approveBtn: {
        backgroundColor: PALETTE.successGreen,
    },
    rejectBtn: {
        backgroundColor: PALETTE.alertRed,
    },
    pendingBtn: {
        backgroundColor: PALETTE.mediumGray,
    },
    btnText: {
        color: PALETTE.white,
        fontWeight: 'bold',
        marginLeft: SPACING.xs,
        fontSize: 12,
    },
    emptyText: {
        color: PALETTE.mediumGray,
        textAlign: 'center',
        marginTop: SPACING.xl,
        ...TYPOGRAPHY.body,
    },
});
