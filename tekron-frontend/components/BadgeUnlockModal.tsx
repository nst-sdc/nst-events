import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableOpacity, Image } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface BadgeUnlockModalProps {
    visible: boolean;
    badgeName: string;
    iconUrl?: string;
    onClose: () => void;
}

export const BadgeUnlockModal = ({ visible, badgeName, iconUrl, onClose }: BadgeUnlockModalProps) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.iconContainer}>
                        {iconUrl ? (
                            <Image source={{ uri: iconUrl }} style={styles.icon} />
                        ) : (
                            <Ionicons name="trophy" size={48} color={PALETTE.pinkLight} />
                        )}
                    </View>
                    <Text style={styles.title}>NEW BADGE!</Text>
                    <Text style={styles.message}>You unlocked "{badgeName}"</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Collect</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    content: {
        backgroundColor: PALETTE.navyLight,
        padding: SPACING.xl,
        borderRadius: RADIUS.l,
        alignItems: 'center',
        width: '100%',
        borderWidth: 2,
        borderColor: PALETTE.pinkLight,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: PALETTE.navyDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.m,
        borderWidth: 2,
        borderColor: PALETTE.pinkLight,
    },
    icon: {
        width: 48,
        height: 48,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.pinkLight,
        marginBottom: SPACING.s,
    },
    message: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        marginBottom: SPACING.l,
        textAlign: 'center',
    },
    button: {
        backgroundColor: PALETTE.pinkLight,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.m,
    },
    buttonText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.navyDark,
        fontWeight: 'bold',
    },
});
