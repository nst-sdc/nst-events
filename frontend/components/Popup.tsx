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
    const gradientColors =
        type === 'success' ? GRADIENTS.success :
            type === 'error' ? GRADIENTS.warning :
                GRADIENTS.primary;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                <View style={styles.content}>
                    <LinearGradient
                        colors={[...gradientColors] as any}
                        style={styles.header}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        locations={[0, 1]}
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
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    header: {
        padding: SPACING.m,
        alignItems: 'center',
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.white,
    },
    body: {
        padding: SPACING.l,
        alignItems: 'center',
    },
    message: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        textAlign: 'center',
        marginBottom: SPACING.l,
    },
    button: {
        backgroundColor: PALETTE.primaryBlue,
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.m,
        elevation: 2,
    },
    buttonText: {
        color: PALETTE.white,
        fontWeight: 'bold',
    },
});
