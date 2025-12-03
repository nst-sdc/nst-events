import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, GRADIENTS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

interface PopupProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    type?: 'success' | 'error' | 'info';
}

export function Popup({ visible, title, message, onClose, type = 'info' }: PopupProps) {
    let gradientColors = GRADIENTS.primary;
    if (type === 'success') gradientColors = [PALETTE.purpleMedium, PALETTE.purpleDeep];
    if (type === 'error') gradientColors = [PALETTE.pinkDark, PALETTE.purpleDeep];

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                <View style={styles.content}>
                    <LinearGradient
                        colors={gradientColors}
                        style={styles.header}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.title}>{title}</Text>
                    </LinearGradient>

                    <View style={styles.body}>
                        <Text style={styles.message}>{message}</Text>

                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    content: {
        width: '100%',
        backgroundColor: PALETTE.creamLight,
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        elevation: 10,
    },
    header: {
        padding: SPACING.m,
        alignItems: 'center',
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
    },
    body: {
        padding: SPACING.l,
        alignItems: 'center',
    },
    message: {
        ...TYPOGRAPHY.body,
        color: PALETTE.navyDark,
        textAlign: 'center',
        marginBottom: SPACING.l,
    },
    button: {
        backgroundColor: PALETTE.purpleDeep,
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.m,
    },
    buttonText: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
});
