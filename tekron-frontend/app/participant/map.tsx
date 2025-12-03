

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Linking, Switch } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '../../constants/config';
import { IndoorMap } from '../../components/IndoorMap';

export default function MapScreen() {
    const { logout } = useAuthStore();
    const [showQR, setShowQR] = useState(false);
    const [mapMode, setMapMode] = useState<'VENUE' | 'INDOOR'>('VENUE');
    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);

    const fetchLocations = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const res = await fetch(`${BACKEND_URL}/locations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLocations(data);
            }

            // Also fetch QR for the modal
            const qrRes = await fetch(`${BACKEND_URL}/participant/qr`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (qrRes.ok) {
                const qrData = await qrRes.json();
                setQrCodeData(qrData.qrCode);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const openGoogleMaps = () => {
        Linking.openURL('https://maps.app.goo.gl/m1h5Hkgu3LsUrnLd9');
    };

    // Placeholder markers for demo
    const markers = locations.map((loc, index) => ({
        x: 20 + (index * 10) % 60,
        y: 30 + (index * 15) % 50,
        label: loc.name
    }));

    return (
        <View style={styles.container}>
            <AppHeader
                title="Venue Map"
                rightIcon="log-out-outline"
                onRightPress={logout}
            />

            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, mapMode === 'VENUE' && styles.activeToggle]}
                    onPress={() => setMapMode('VENUE')}
                >
                    <Text style={[styles.toggleText, mapMode === 'VENUE' && styles.activeToggleText]}>Venue Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, mapMode === 'INDOOR' && styles.activeToggle]}
                    onPress={() => setMapMode('INDOOR')}
                >
                    <Text style={[styles.toggleText, mapMode === 'INDOOR' && styles.activeToggleText]}>Indoor Map</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={PALETTE.creamLight} style={{ marginTop: 50 }} />
                ) : mapMode === 'VENUE' ? (
                    <WebView
                        originWhitelist={['*']}
                        source={{ uri: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d73.91411937501422!3d18.56206128253963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4136c54!2sPhoenix%20Marketcity%20-%20Viman%20Nagar!5e0!3m2!1sen!2sin!4v1709636660000!5m2!1sen!2sin' }}
                        style={styles.webview}
                    />
                ) : (
                    <IndoorMap markers={markers} />
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => setShowQR(true)}
                >
                    <Ionicons name="qr-code-outline" size={20} color={PALETTE.purpleDeep} />
                    <Text style={styles.primaryButtonText}>Show My Entry Pass</Text>
                </TouchableOpacity>

                {mapMode === 'VENUE' && (
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={openGoogleMaps}
                    >
                        <Ionicons name="map-outline" size={20} color={PALETTE.creamLight} />
                        <Text style={styles.secondaryButtonText}>Open in Google Maps</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Modal
                visible={showQR}
                transparent
                animationType="slide"
                onRequestClose={() => setShowQR(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowQR(false)}
                        >
                            <Ionicons name="close" size={24} color={PALETTE.navyDark} />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Your Entry Pass</Text>

                        <View style={styles.qrWrapper}>
                            {qrCodeData ? (
                                <QRCode
                                    value={qrCodeData}
                                    size={200}
                                    backgroundColor="white"
                                    color="black"
                                />
                            ) : (
                                <Text>Loading QR...</Text>
                            )}
                        </View>

                        <Text style={styles.modalInstruction}>
                            Show this to the event staff to get approved.
                        </Text>
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
    toggleContainer: {
        flexDirection: 'row',
        padding: SPACING.m,
        gap: SPACING.m,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: SPACING.s,
        alignItems: 'center',
        borderRadius: RADIUS.m,
        backgroundColor: PALETTE.purpleDeep,
        borderWidth: 1,
        borderColor: PALETTE.purpleMedium,
    },
    activeToggle: {
        backgroundColor: PALETTE.pinkLight,
        borderColor: PALETTE.pinkLight,
    },
    toggleText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
    activeToggleText: {
        color: PALETTE.navyDark,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
    },
    footer: {
        padding: SPACING.m,
        backgroundColor: PALETTE.purpleDeep,
        borderTopLeftRadius: RADIUS.l,
        borderTopRightRadius: RADIUS.l,
        gap: SPACING.m,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PALETTE.creamLight,
        paddingVertical: SPACING.m,
        borderRadius: RADIUS.m,
        gap: SPACING.s,
    },
    primaryButtonText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.purpleDeep,
        fontSize: 16,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: SPACING.m,
        borderRadius: RADIUS.m,
        gap: SPACING.s,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    secondaryButtonText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    modalContent: {
        backgroundColor: PALETTE.creamLight,
        width: '100%',
        borderRadius: RADIUS.l,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.m,
        right: SPACING.m,
        padding: SPACING.s,
    },
    modalTitle: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.navyDark,
        marginBottom: SPACING.xl,
    },
    qrWrapper: {
        padding: SPACING.m,
        backgroundColor: 'white',
        borderRadius: RADIUS.m,
        marginBottom: SPACING.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    modalInstruction: {
        ...TYPOGRAPHY.body,
        color: PALETTE.purpleDeep,
        textAlign: 'center',
    },
});
