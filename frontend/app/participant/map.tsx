
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import { storage } from '../../utils/storage';
import { BACKEND_URL } from '../../constants/config';
import { IndoorMap } from '../../components/IndoorMap';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';

const CampusMap = require('../../assets/images/campus-map.png');

export default function MapScreen() {
    const { user, logout } = useAuthStore();
    const [showQR, setShowQR] = useState(false);
    const [mapMode, setMapMode] = useState<'VENUE' | 'INDOOR'>('VENUE');
    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [unapprovedMapData, setUnapprovedMapData] = useState<any>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = await storage.getItem('token');

                if (user?.approved) {
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
                } else {
                    // Fetch unapproved map data
                    const res = await fetch(`${BACKEND_URL}/participant/unapproved-map`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUnapprovedMapData(data);
                        setQrCodeData(data.qrCode);
                    }
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, [user]);



    const openGoogleMaps = () => {
        Linking.openURL('https://maps.app.goo.gl/m1h5Hkgu3LsUrnLd9');
    };

    // Placeholder markers for demo
    const markers = locations.map((loc, index) => ({
        x: 20 + (index * 10) % 60,
        y: 30 + (index * 15) % 50,
        label: loc.name
    }));


    const wrapHtmlContent = (content: string) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
            body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background-color: #FFFFFF; }
            iframe { width: 100%; height: 100%; border: 0; }
        </style>
    </head>
    <body>
        ${content}
    </body>
    </html>
    `;

    const VENUE_MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4662.709054519496!2d73.91173417216432!3d18.620788433613384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7007ca391d7%3A0x9da4723c416a8ee5!2sNewton%20school%20of%20technology%20pune%20campus!5e1!3m2!1sen!2sin!4v1769055274617!5m2!1sen!2sin';

    const renderMapContent = () => {
        if (!user?.approved) {
            if (Platform.OS === 'web') {
                return (
                    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                        <iframe
                            srcDoc={wrapHtmlContent(unapprovedMapData?.mapIframe || '<h1>Loading Map...</h1>')}
                            style={{ width: '100%', height: '100%', border: 0 }}
                        />
                    </div>
                );
            }
            return (
                <View style={{ flex: 1 }}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: wrapHtmlContent(unapprovedMapData?.mapIframe || '<h1>Loading Map...</h1>') }}
                        style={styles.webview}
                    />
                    {unapprovedMapData?.instructions && (
                        <View style={styles.instructionContainer}>
                            <Text style={styles.instructionText}>{unapprovedMapData.instructions}</Text>
                        </View>
                    )}
                </View>
            );
        }

        if (mapMode === 'VENUE') {
            if (Platform.OS === 'web') {
                return (
                    <iframe
                        src={VENUE_MAP_EMBED_URL}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                );
            }
            return (
                <WebView
                    originWhitelist={['*']}
                    source={{ html: wrapHtmlContent(`<iframe src="${VENUE_MAP_EMBED_URL}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`) }}
                    style={styles.webview}
                />
            );
        }

        return <IndoorMap imageSource={CampusMap} />;
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Venue Map"
                rightIcon="log-out-outline"
                onRightPress={logout}
                showBack={true}
            />

            {user?.approved && (
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
            )}

            <View style={styles.contentContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={PALETTE.primaryBlue} style={{ marginTop: 50 }} />
                ) : (
                    renderMapContent()
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => setShowQR(true)}
                >
                    <Ionicons name="qr-code-outline" size={20} color={PALETTE.white} />
                    <Text style={styles.primaryButtonText}>Show My Entry Pass</Text>
                </TouchableOpacity>

                {(mapMode === 'VENUE' || !user?.approved) && (
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={openGoogleMaps}
                    >
                        <Ionicons name="map-outline" size={20} color={PALETTE.primaryBlue} />
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
                            <Ionicons name="close" size={24} color={PALETTE.darkGray} />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Your Entry Pass</Text>

                        <View style={styles.qrWrapper}>
                            {qrCodeData ? (
                                <QRCodeDisplay
                                    value={qrCodeData}
                                    size={200}
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
        backgroundColor: PALETTE.bgSuperLight,
    },
    toggleContainer: {
        flexDirection: 'row',
        padding: SPACING.m,
        gap: SPACING.m,
        backgroundColor: PALETTE.white,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: SPACING.s,
        alignItems: 'center',
        borderRadius: RADIUS.m,
        backgroundColor: PALETTE.white,
        borderWidth: 1,
        borderColor: PALETTE.blueMedium,
    },
    activeToggle: {
        backgroundColor: PALETTE.primaryBlue,
        borderColor: PALETTE.primaryBlue,
    },
    toggleText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        fontWeight: 'bold',
    },
    activeToggleText: {
        color: PALETTE.white,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: PALETTE.bgSuperLight,
    },
    webview: {
        flex: 1,
    },
    footer: {
        padding: SPACING.m,
        backgroundColor: PALETTE.white,
        borderTopLeftRadius: RADIUS.l,
        borderTopRightRadius: RADIUS.l,
        gap: SPACING.m,
        shadowColor: Platform.OS === 'web' ? 'transparent' : '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PALETTE.primaryBlue,
        paddingVertical: SPACING.m,
        borderRadius: RADIUS.m,
        gap: SPACING.s,
    },
    primaryButtonText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.white,
        fontSize: 16,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PALETTE.blueLight,
        paddingVertical: SPACING.m,
        borderRadius: RADIUS.m,
        gap: SPACING.s,
        borderWidth: 1,
        borderColor: PALETTE.blueMedium,
    },
    secondaryButtonText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.primaryBlue,
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
        backgroundColor: PALETTE.white,
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
        color: PALETTE.darkGray,
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
        color: PALETTE.darkGray,
        textAlign: 'center',
    },
    instructionContainer: {
        padding: SPACING.m,
        backgroundColor: PALETTE.blueLight,
        alignItems: 'center',
    },
    instructionText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.primaryBlue,
        textAlign: 'center',
    },
});
