import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { useAuthStore } from '../context/authStore';
import { BACKEND_URL } from '../constants/config';
import { storage } from '../utils/storage';

export const EmergencyBanner = () => {
    const [alert, setAlert] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const checkAlerts = async () => {
            try {
                const token = await storage.getItem('token');
                if (!token) return;

                const res = await fetch(`${BACKEND_URL}/alerts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const alerts = await res.json();
                    // Find latest emergency alert
                    const emergency = alerts.find((a: any) => a.isEmergency);
                    if (emergency) {
                        setAlert(emergency);
                        setVisible(true);
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true
                        }).start();
                    }
                }
            } catch (error) {
                console.error('Error checking alerts:', error);
            }
        };

        // Poll for alerts every minute (in real app, use sockets)
        checkAlerts();
        const interval = setInterval(checkAlerts, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!visible || !alert) return null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.content}>
                <Ionicons name="warning" size={24} color="white" />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>EMERGENCY ALERT</Text>
                    <Text style={styles.message}>{alert.message}</Text>
                </View>
                <TouchableOpacity onPress={() => setVisible(false)}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ef4444', // Red
        zIndex: 1000,
        paddingTop: 50, // Status bar safe area
        paddingBottom: SPACING.m,
        paddingHorizontal: SPACING.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: 'white',
        fontWeight: 'bold',
    },
    message: {
        ...TYPOGRAPHY.body,
        color: 'white',
        fontSize: 14,
    },
});
