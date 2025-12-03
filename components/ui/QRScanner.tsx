import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './Typography';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose?: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <ThemedText style={styles.message}>We need your permission to show the camera</ThemedText>
                <TouchableOpacity onPress={requestPermission} style={styles.button}>
                    <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        onScan(data);
        // Reset scanned state after a delay if needed, or let parent handle it
        setTimeout(() => setScanned(false), 2000);
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <ThemedText variant="h3" style={styles.title}>Scan QR Code</ThemedText>
                        {onClose && (
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.scanArea}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    <ThemedText style={styles.instruction}>
                        Align QR code within the frame
                    </ThemedText>
                </View>
            </CameraView>
        </View>
    );
}

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    title: {
        color: '#FFF',
    },
    closeButton: {
        position: 'absolute',
        right: Spacing.l,
        padding: Spacing.s,
    },
    scanArea: {
        width: SCAN_SIZE,
        height: SCAN_SIZE,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    instruction: {
        marginTop: Spacing.xl,
        color: '#FFF',
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: '#FFF',
    },
    button: {
        alignSelf: 'center',
        backgroundColor: Colors.dark.primary,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: Colors.dark.primary,
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
});
