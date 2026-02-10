import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Easing } from 'react-native';
import Toast from 'react-native-toast-message';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import { useAdminStore } from '../../context/adminStore';

export default function Scanner() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { validateParticipant, isLoading } = useAdminStore();

    // Animation value for scan line
    const scanAnim = useRef(new Animated.Value(0)).current;

    const [facing, setFacing] = useState<'front' | 'back'>('back');

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    useEffect(() => {
        if (!scanned) {
            const startAnimation = () => {
                scanAnim.setValue(0);
                Animated.loop(
                    Animated.timing(scanAnim, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ).start();
            };
            startAnimation();
        } else {
            scanAnim.stopAnimation();
        }
    }, [scanned]);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <AppHeader title="Scanner" showBack />
                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={64} color={PALETTE.mediumGray} />
                    <Text style={styles.permissionText}>We need your permission to access the camera</Text>
                    <TouchableOpacity onPress={requestPermission}>
                        <LinearGradient
                            colors={[...GRADIENTS.primary]}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>Grant Permission</Text>
                        </LinearGradient>
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
            if (participant.approved) {
                Alert.alert(
                    "Already Approved",
                    `${participant.name} is already verified.`,
                    [{ text: "OK", onPress: () => setScanned(false) }]
                );
            } else {
                // Navigate to approval screen with participant data
                router.push({
                    pathname: '/admin/approval',
                    params: { id: participant.id, data: JSON.stringify(participant) }
                });
                // Reset scan state after a delay or when returning
                setTimeout(() => setScanned(false), 2000);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Invalid QR Code',
                text2: 'Could not validate participant.'
            });
            setScanned(false);
        }
    };

    const translateY = scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 250] // Match scanFrame height
    });

    return (
        <View style={styles.container}>
            <AppHeader title="Scan QR Code" showBack />
            <Loader visible={isLoading} />

            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing={facing}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
                <View style={styles.overlay}>
                    <View style={styles.scanFrame}>
                        {!scanned && (
                            <Animated.View
                                style={[
                                    styles.scanLine,
                                    { transform: [{ translateY }] }
                                ]}
                            >
                                <LinearGradient
                                    colors={['rgba(56, 189, 248, 0)', 'rgba(56, 189, 248, 0.8)', 'rgba(56, 189, 248, 0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientLine}
                                />
                            </Animated.View>
                        )}
                    </View>
                    <Text style={styles.instructionText}>Align QR code within the frame</Text>

                    <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
                        <Ionicons name="camera-reverse" size={32} color={PALETTE.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    permissionText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        marginTop: SPACING.l,
    },
    button: {
        backgroundColor: PALETTE.purpleMedium,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
    },
    buttonText: {
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    cameraContainer: {
        flex: 1,
        overflow: 'hidden',
        borderTopLeftRadius: RADIUS.l,
        borderTopRightRadius: RADIUS.l,
        backgroundColor: 'black',
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
        overflow: 'hidden', // Ensure scan line doesn't go outside
        position: 'relative',
    },
    scanLine: {
        width: '100%',
        height: 2,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    gradientLine: {
        width: '100%',
        height: '100%',
    },
    instructionText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.white,
        marginTop: SPACING.l,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: SPACING.s,
        borderRadius: RADIUS.s,
        overflow: 'hidden',
    },
    flipButton: {
        position: 'absolute',
        bottom: 40,
        right: 40,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 30,
    }
});
