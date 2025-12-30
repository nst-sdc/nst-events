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
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [currentRound, setCurrentRound] = useState('');

    // New Event Form State
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        location: '',
        startTime: '',
        endTime: ''
    });

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${BACKEND_URL}/superadmin/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                // Fallback if not superadmin (though auth check should handle it)
                console.log("Failed to fetch from superadmin/events, trying participant/events");
                const res2 = await fetch(`${BACKEND_URL}/participant/events`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res2.ok) {
                    const data = await res2.json();
                    setEvents(data);
                }
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

    const handleCreateEvent = async () => {
        if (!newEvent.title || !newEvent.location) {
            Alert.alert('Error', 'Title and Location are required');
            return;
        }

        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${BACKEND_URL}/superadmin/create-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newEvent)
            });

            if (response.ok) {
                Alert.alert('Success', 'Event created successfully');
                setCreateModalVisible(false);
                setNewEvent({ title: '', description: '', location: '', startTime: '', endTime: '' });
                fetchEvents();
            } else {
                const err = await response.json();
                Alert.alert('Error', err.message || 'Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            Alert.alert('Error', 'Failed to create event');
        }
    };

    const updateStatus = async (id: string, status: string, round?: number) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            // Try updating via superadmin route if strictly superadmin, or admin route?
            // superAdminRoutes has router.put('/events/:id', updateEvent);
            // adminRoutes has router.patch('/events/:id/status', updateEventStatus);
            // I'll try the admin route first as it's for status. 
            // Actually, let's use the one that works for the user role.
            // If superadmin, I can use the superadmin update endpoint which does full update.
            // But for status update, the PATCH is cleaner.

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
            <AppHeader
                title="Manage Events"
                showBack
                rightIcon="add-circle-outline"
                onRightPress={() => setCreateModalVisible(true)}
            />
            <Loader visible={loading} />

            <ScrollView contentContainerStyle={styles.content}>
                {events.length === 0 && !loading && (
                    <Text style={{ color: PALETTE.purpleLight, textAlign: 'center', marginTop: 20 }}>
                        No events found. Create one!
                    </Text>
                )}
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

            {/* Status Update Modal */}
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

            {/* Create Event Modal */}
            <Modal
                visible={createModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Event</Text>

                        <ScrollView>
                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newEvent.title}
                                onChangeText={(t) => setNewEvent({ ...newEvent, title: t })}
                                placeholder="Event Title"
                                placeholderTextColor={PALETTE.purpleLight}
                            />

                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={newEvent.location}
                                onChangeText={(t) => setNewEvent({ ...newEvent, location: t })}
                                placeholder="Venue"
                                placeholderTextColor={PALETTE.purpleLight}
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                value={newEvent.description}
                                onChangeText={(t) => setNewEvent({ ...newEvent, description: t })}
                                placeholder="Event details..."
                                placeholderTextColor={PALETTE.purpleLight}
                                multiline
                            />

                            <Text style={styles.label}>Start Time (YYYY-MM-DD HH:mm)</Text>
                            <TextInput
                                style={styles.input}
                                value={newEvent.startTime}
                                onChangeText={(t) => setNewEvent({ ...newEvent, startTime: t })}
                                placeholder="2024-12-31 10:00"
                                placeholderTextColor={PALETTE.purpleLight}
                            />

                            <Text style={styles.label}>End Time (YYYY-MM-DD HH:mm)</Text>
                            <TextInput
                                style={styles.input}
                                value={newEvent.endTime}
                                onChangeText={(t) => setNewEvent({ ...newEvent, endTime: t })}
                                placeholder="2024-12-31 12:00"
                                placeholderTextColor={PALETTE.purpleLight}
                            />
                        </ScrollView>

                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: PALETTE.purpleMedium, marginRight: 8 }]}
                                onPress={handleCreateEvent}
                            >
                                <Text style={styles.actionButtonText}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: PALETTE.navyLight, marginLeft: 8 }]}
                                onPress={() => setCreateModalVisible(false)}
                            >
                                <Text style={styles.actionButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
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
        maxHeight: '80%',
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
