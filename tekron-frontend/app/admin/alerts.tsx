import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { GradientButton } from '../../components/GradientButton';
import { Loader } from '../../components/Loader';
import { Popup } from '../../components/Popup';
import { useAdminStore } from '../../context/adminStore';

import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../constants/config';
import { storage } from '../../utils/storage';

export default function SendAlert() {
    const router = useRouter();
    const { sendAlert, isLoading: isSending } = useAdminStore();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    // Targeting State
    const [targetScope, setTargetScope] = useState<'all' | 'event'>('all');
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    // Fetch events only if user switches to 'event' scope
    const handleScopeChange = async (scope: 'all' | 'event') => {
        setTargetScope(scope);
        if (scope === 'event' && events.length === 0) {
            setIsLoadingEvents(true);
            try {
                const token = await storage.getItem('token');
                // Use the same robust fetching strategy as AdminEvents
                let response = await fetch(`${BACKEND_URL}/superadmin/events`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    // Fallback to participant events or live events if superadmin fails (e.g. role issue)
                    response = await fetch(`${BACKEND_URL}/events/live`);
                }

                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load events' });
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
                Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load events' });
            } finally {
                setIsLoadingEvents(false);
            }
        }
    };

    const toggleEventSelection = (eventId: string) => {
        setSelectedEventIds(prev => prev.includes(eventId)
            ? prev.filter(id => id !== eventId)
            : [...prev, eventId]
        );
    };

    const handleSend = async () => {
        if (!title || !message) {
            Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please enter title and message' });
            return;
        }

        if (targetScope === 'event' && selectedEventIds.length === 0) {
            Toast.show({ type: 'error', text1: 'Selection Required', text2: 'Please select at least one event' });
            return;
        }

        try {
            await sendAlert(title, message, { targetScope, targetEventIds: selectedEventIds });

            Toast.show({ type: 'success', text1: 'Sent!', text2: 'Alert pushed to recipients.' });
            router.back();
        } catch (error) {
            // Error handled by store usually
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Send Alert"
                showBack
                onBackPress={() => router.push('/admin/dashboard')}
            />
            <Loader visible={isSending} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.label}>Alert Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Session Starting Soon"
                        placeholderTextColor={PALETTE.mediumGray}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Type your announcement here..."
                        placeholderTextColor={PALETTE.mediumGray}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* Target Selection */}
                    <Text style={styles.label}>Target Audience</Text>
                    <View style={styles.scopeContainer}>
                        <TouchableOpacity
                            style={[styles.scopeButton, targetScope === 'all' && styles.scopeButtonActive]}
                            onPress={() => handleScopeChange('all')}
                        >
                            <Text style={[styles.scopeText, targetScope === 'all' && styles.scopeTextActive]}>All Participants</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.scopeButton, targetScope === 'event' && styles.scopeButtonActive]}
                            onPress={() => handleScopeChange('event')}
                        >
                            <Text style={[styles.scopeText, targetScope === 'event' && styles.scopeTextActive]}>Specific Events</Text>
                        </TouchableOpacity>
                    </View>

                    {targetScope === 'event' && (
                        <View style={styles.eventListContainer}>
                            {isLoadingEvents ? (
                                <Text style={styles.loadingText}>Loading events...</Text>
                            ) : events.length === 0 ? (
                                <Text style={styles.loadingText}>No events found.</Text>
                            ) : (
                                events.map(event => {
                                    const isSelected = selectedEventIds.includes(event.id);
                                    return (
                                        <TouchableOpacity
                                            key={event.id}
                                            style={[styles.eventItem, isSelected && styles.eventItemSelected]}
                                            onPress={() => toggleEventSelection(event.id)}
                                        >
                                            <Text style={[styles.eventItemText, isSelected && styles.eventItemTextSelected]}>
                                                {event.title}
                                            </Text>
                                            {isSelected && <Ionicons name="checkmark-circle" size={20} color={PALETTE.primaryBlue} />}
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </View>
                    )}

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>Note:</Text>
                        <Text style={styles.warningText}>
                            {targetScope === 'all'
                                ? "This alert will be sent to ALL registered participants."
                                : `This alert will be sent to participants of ${selectedEventIds.length} selected event(s).`}
                        </Text>
                    </View>

                    <GradientButton
                        title="Send Alert"
                        onPress={handleSend}
                        style={styles.button}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        padding: SPACING.l,
    },
    label: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        marginBottom: SPACING.s,
        fontWeight: '600',
    },
    input: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        color: PALETTE.creamLight,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    textArea: {
        height: 120,
    },
    warningBox: {
        backgroundColor: 'rgba(247, 232, 164, 0.1)', // Yellow with opacity
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.xl,
        borderLeftWidth: 4,
        borderLeftColor: PALETTE.yellowLight,
    },
    warningTitle: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.yellowLight,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    warningText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
    },
    button: {
        marginTop: SPACING.s,
    },
    scopeContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.m,
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        padding: 4,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
    },
    scopeButton: {
        flex: 1,
        paddingVertical: SPACING.s,
        alignItems: 'center',
        borderRadius: RADIUS.s,
    },
    scopeButtonActive: {
        backgroundColor: PALETTE.blueLight,
    },
    scopeText: {
        fontWeight: '600',
        color: PALETTE.mediumGray,
    },
    scopeTextActive: {
        color: PALETTE.primaryBlue,
    },
    eventListContainer: {
        marginBottom: SPACING.l,
        maxHeight: 200,
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
        padding: SPACING.s,
    },
    eventItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: PALETTE.lightGray,
    },
    eventItemSelected: {
        backgroundColor: PALETTE.blueLight,
        borderRadius: RADIUS.s,
    },
    eventItemText: {
        color: PALETTE.darkGray,
    },
    eventItemTextSelected: {
        fontWeight: 'bold',
        color: PALETTE.primaryBlue,
    },
    loadingText: {
        padding: SPACING.m,
        textAlign: 'center',
        color: PALETTE.mediumGray,
    },
});
