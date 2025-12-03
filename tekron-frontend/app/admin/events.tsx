import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { Card } from '../../components/Card';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '../../constants/config';

interface Event {
    id: string;
    title: string;
    status: 'UPCOMING' | 'LIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
    currentRound?: number;
}

export default function AdminEvents() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRound, setCurrentRound] = useState('');

    const fetchEvents = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            // Using participant endpoint for list, admin endpoint for updates
            // Ideally should have admin endpoint for all events including status
            const response = await fetch(`${BACKEND_URL}/participant/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const updateStatus = async (id: string, status: string, round?: number) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${BACKEND_URL}/admin/events/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status, currentRound: round })
            });

            if (response.ok) {
                Alert.alert('Success', 'Event status updated');
                fetchEvents();
                setModalVisible(false);
            } else {
                Alert.alert('Error', 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const openModal = (event: Event) => {
        setSelectedEvent(event);
        setCurrentRound(event.currentRound?.toString() || '');
        setModalVisible(true);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let color = PALETTE.purpleLight;
        if (status === 'LIVE') color = PALETTE.pinkLight;
        if (status === 'COMPLETED') color = PALETTE.creamDark;

        return (
            <View style={[styles.badge, { backgroundColor: color }]}>
                <Text style={styles.badgeText}>{status}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Manage Events" showBack />
            <Loader visible={loading} />

            <ScrollView contentContainerStyle={styles.content}>
                {events.map((event) => (
                    <Card key={event.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.eventTitle}>{event.title}</Text>
                            <StatusBadge status={event.status} />
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: PALETTE.purpleMedium }]}
                                onPress={() => openModal(event)}
                            >
                                <Text style={styles.actionButtonText}>Update Status</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: PALETTE.navyLight }]}
                                onPress={() => router.push({ pathname: '/admin/leaderboard', params: { eventId: event.id } })}
                            >
                                <Text style={styles.actionButtonText}>Leaderboard</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update {selectedEvent?.title}</Text>

                        <Text style={styles.label}>Status</Text>
                        <View style={styles.statusOptions}>
                            {['UPCOMING', 'LIVE', 'PAUSED', 'COMPLETED'].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    style={[
                                        styles.statusOption,
                                        selectedEvent?.status === status && styles.statusOptionSelected
                                    ]}
                                    onPress={() => updateStatus(selectedEvent!.id, status, parseInt(currentRound) || undefined)}
                                >
                                    <Text style={[
                                        styles.statusOptionText,
                                        selectedEvent?.status === status && styles.statusOptionTextSelected
                                    ]}>{status}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Current Round (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={currentRound}
                            onChangeText={setCurrentRound}
                            placeholder="Round Number"
                            placeholderTextColor={PALETTE.purpleLight}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    card: {
        marginBottom: SPACING.m,
        backgroundColor: PALETTE.purpleDeep,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    eventTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        flex: 1,
    },
    badge: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
    },
    badgeText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.navyDark,
        fontWeight: 'bold',
    },
    actionRow: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    actionButton: {
        flex: 1,
        padding: SPACING.s,
        borderRadius: RADIUS.m,
        alignItems: 'center',
    },
    actionButtonText: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: SPACING.l,
    },
    modalContent: {
        backgroundColor: PALETTE.navyDark,
        borderRadius: RADIUS.l,
        padding: SPACING.l,
        borderWidth: 1,
        borderColor: PALETTE.purpleLight,
    },
    modalTitle: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.creamLight,
        marginBottom: SPACING.l,
        textAlign: 'center',
    },
    label: {
        ...TYPOGRAPHY.body,
        color: PALETTE.purpleLight,
        marginBottom: SPACING.s,
    },
    statusOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    statusOption: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.purpleLight,
    },
    statusOptionSelected: {
        backgroundColor: PALETTE.pinkMedium,
        borderColor: PALETTE.pinkLight,
    },
    statusOptionText: {
        color: PALETTE.purpleLight,
    },
    statusOptionTextSelected: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: PALETTE.purpleDeep,
        color: PALETTE.creamLight,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.l,
    },
    closeButton: {
        padding: SPACING.m,
        alignItems: 'center',
    },
    closeButtonText: {
        color: PALETTE.creamDark,
    },
});
