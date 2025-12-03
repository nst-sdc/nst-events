import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import { useAdminStore } from '../../context/adminStore';

export default function Scanner() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { validateParticipant, isLoading } = useAdminStore();

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <AppHeader title="Scanner" showBack />
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.button}>
                        <Text style={styles.buttonText}>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);

        const participant = await validateParticipant(data);

        if (participant) {
            // Navigate to approval screen with participant data
            router.push({
                pathname: '/admin/approval',
                params: { id: participant.id, data: JSON.stringify(participant) }
            });
            // Reset scan state after a delay or when returning
            setTimeout(() => setScanned(false), 2000);
        } else {
            Alert.alert('Invalid QR Code', 'Could not validate participant.', [
                { text: 'OK', onPress: () => setScanned(false) }
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Scan QR Code" showBack />
            <Loader visible={isLoading} />

            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
                <View style={styles.overlay}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.instructionText}>Align QR code within the frame</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.navyDark,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    permissionText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        textAlign: 'center',
        marginBottom: SPACING.m,
    },
    button: {
        backgroundColor: PALETTE.purpleMedium,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
    },
    buttonText: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
    cameraContainer: {
        flex: 1,
        overflow: 'hidden',
        borderTopLeftRadius: RADIUS.l,
        borderTopRightRadius: RADIUS.l,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: PALETTE.pinkLight,
        backgroundColor: 'transparent',
        borderRadius: RADIUS.m,
    },
    instructionText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        marginTop: SPACING.l,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: SPACING.s,
        borderRadius: RADIUS.s,
        overflow: 'hidden',
    },
});
