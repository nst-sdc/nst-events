import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '../../constants/config';

export default function LimitedAccessMap() {
    const { logout } = useAuthStore();
    const [showQR, setShowQR] = useState(false);
    const [mapData, setMapData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch Map Data
    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const response = await fetch(`${BACKEND_URL}/participant/unapproved-map`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMapData(data);
                }
            } catch (error) {
                console.error('Error fetching map data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMapData();
    }, []);

    const openGoogleMaps = () => {
        Linking.openURL('https://maps.app.goo.gl/m1h5Hkgu3LsUrnLd9');
    };

    // Extract src from iframe string if needed, or just use the direct URL for WebView if iframe doesn't render well
    // WebView can render HTML string directly.
    const mapHtml = mapData?.mapIframe
        ? `<html><body style="margin:0;padding:0;height:100%;width:100%;display:flex;">${mapData.mapIframe}</body></html>`
        : null;

    return (
        <View style={styles.container}>
            <AppHeader
                title="Venue Map"
                rightIcon="log-out-outline"
                onRightPress={logout}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={PALETTE.creamLight} />
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    <View style={styles.mapContainer}>
                        {mapHtml ? (
                            <WebView
                                originWhitelist={['*']}
                                source={{ html: mapHtml }}
                                style={styles.webview}
                                scrollEnabled={false}
                            />
                        ) : (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>Map unavailable</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.statusBanner}>
                            <Ionicons name="lock-closed" size={16} color={PALETTE.creamLight} />
                            <Text style={styles.statusText}>Access Restricted</Text>
                        </View>

                        <Text style={styles.locationTitle}>{mapData?.locationName || 'Event Location'}</Text>
                        <Text style={styles.instructionText}>
                            {mapData?.instructions || 'Please proceed to the registration desk.'}
                        </Text>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => setShowQR(true)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="qr-code-outline" size={20} color={PALETTE.purpleDeep} />
                                <Text style={styles.primaryButtonText}>Show My QR Code</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={openGoogleMaps}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="map-outline" size={20} color={PALETTE.creamLight} />
                                <Text style={styles.secondaryButtonText}>Open in Google Maps</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

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
                            {mapData?.qrCode ? (
                                <QRCode
                                    value={mapData.qrCode}
                                    size={200}
                                    backgroundColor="white"
                                    color="black"
                                />
                            ) : (
                                <Text>QR Code not found</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    mapContainer: {
        flex: 1, // Takes up remaining space
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        opacity: 0.8,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: PALETTE.creamLight,
    },
    infoContainer: {
        backgroundColor: PALETTE.purpleDeep,
        borderTopLeftRadius: RADIUS.l,
        borderTopRightRadius: RADIUS.l,
        padding: SPACING.l,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        paddingBottom: SPACING.xl, // Extra padding for bottom safe area
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.pinkDark,
        paddingVertical: 4,
        paddingHorizontal: SPACING.m,
        borderRadius: RADIUS.round,
        marginBottom: SPACING.m,
    },
    statusText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.creamLight,
        fontWeight: 'bold',
        marginLeft: SPACING.s,
        textTransform: 'uppercase',
    },
    locationTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        textAlign: 'center',
        marginBottom: SPACING.s,
    },
    instructionText: {
        ...TYPOGRAPHY.body,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginBottom: SPACING.l,
    },
    buttonGroup: {
        width: '100%',
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
