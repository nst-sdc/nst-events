import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import { GradientButton } from '../../components/GradientButton';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_URL } from '../../constants/config';

export default function Register() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            // Fetch public live/upcoming events for registration
            // Assuming we can access a public events endpoint or use the simple participant one
            const response = await fetch(`${BACKEND_URL}/events/live`);
            const data = await response.json();

            if (response.ok) {
                setEvents(data);
            } else {
                console.error("Failed to fetch events");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleRegister = async () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (selectedEventIds.length === 0) {
            Alert.alert("Required", "Please select at least one event to register for.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/auth/participant/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    eventIds: selectedEventIds
                })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert(
                    "Registration Successful",
                    "Your account has been created and is pending approval. You can login to see your status.",
                    [{
                        text: "Login",
                        onPress: () => router.replace('/auth/login')
                    }]
                );
            } else {
                Alert.alert("Registration Failed", data.message || "Something went wrong");
            }
        } catch (error) {
            Alert.alert("Error", "Network request failed");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleEventSelection = (eventId: string) => {
        setSelectedEventIds(prev => {
            if (prev.includes(eventId)) {
                return prev.filter(id => id !== eventId);
            } else {
                return [...prev, eventId];
            }
        });
    };

    const renderEventItem = (event: any) => {
        const isSelected = selectedEventIds.includes(event.id);

        return (
            <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, isSelected && styles.eventCardSelected]}
                onPress={() => toggleEventSelection(event.id)}
            >
                <View style={styles.eventInfo}>
                    <Text style={[styles.eventTitle, isSelected && styles.textSelected]}>{event.title}</Text>
                    <Text style={[styles.eventDate, isSelected && styles.textSelectedDim]}>
                        {new Date(event.startTime).toLocaleDateString()}
                    </Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color={PALETTE.white} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Join Tekron" showBack />
            <Loader visible={isLoading} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Create Account</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color={PALETTE.mediumGray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor={PALETTE.mediumGray}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email (University ID)</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={PALETTE.mediumGray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="student@university.edu"
                            placeholderTextColor={PALETTE.mediumGray}
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={PALETTE.mediumGray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={PALETTE.mediumGray}
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={PALETTE.mediumGray} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={PALETTE.mediumGray}
                            value={formData.confirmPassword}
                            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                            secureTextEntry
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Select Events</Text>
                <Text style={styles.helperText}>You must register for at least one event.</Text>

                {loadingEvents ? (
                    <Text style={styles.loadingText}>Loading available events...</Text>
                ) : events.length === 0 ? (
                    <Text style={styles.errorText}>No open events found.</Text>
                ) : (
                    <View style={styles.eventsList}>
                        {events.map(renderEventItem)}
                    </View>
                )}

                <GradientButton
                    title="Register"
                    onPress={handleRegister}
                    style={styles.registerButton}
                />
            </ScrollView>
        </View>
    );
}

// Need to import TextInput which I missed in imports
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    content: {
        padding: SPACING.l,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        marginBottom: SPACING.m,
        marginTop: SPACING.s,
    },
    helperText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        marginBottom: SPACING.m,
    },
    inputGroup: {
        marginBottom: SPACING.m,
    },
    label: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: PALETTE.darkGray,
        marginBottom: SPACING.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.mediumGray,
        paddingHorizontal: SPACING.m,
        height: 50,
    },
    inputIcon: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        color: PALETTE.black,
        fontSize: 16,
    },
    eventsList: {
        marginBottom: SPACING.xl,
        gap: SPACING.s,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.white,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.mediumGray,
    },
    eventCardSelected: {
        backgroundColor: PALETTE.blueLight,
        borderColor: PALETTE.primaryBlue,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        ...TYPOGRAPHY.body,
        fontWeight: 'bold',
        color: PALETTE.darkGray,
    },
    eventDate: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        marginTop: 2,
    },
    textSelected: {
        color: PALETTE.primaryBlue,
    },
    textSelectedDim: {
        color: PALETTE.blueDark,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: PALETTE.mediumGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: PALETTE.primaryBlue,
        borderColor: PALETTE.primaryBlue,
    },
    loadingText: {
        textAlign: 'center',
        color: PALETTE.mediumGray,
        marginBottom: SPACING.l,
    },
    errorText: {
        color: PALETTE.alertRed,
        marginBottom: SPACING.m,
    },
    registerButton: {
        marginTop: SPACING.m,
        marginBottom: SPACING.xxl,
    },
});
