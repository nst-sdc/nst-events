import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableOpacity } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface LevelUpModalProps {
    visible: boolean;
    level: number;
    onClose: () => void;
}

export const LevelUpModal = ({ visible, level, onClose }: LevelUpModalProps) => {
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
                    <Ionicons name="star" size={64} color={PALETTE.yellowLight} style={styles.icon} />
                    <Text style={styles.title}>LEVEL UP!</Text>
                    <Text style={styles.message}>You reached Level {level}</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Awesome!</Text>
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
        borderColor: PALETTE.yellowLight,
    },
    icon: {
        marginBottom: SPACING.m,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.yellowLight,
        marginBottom: SPACING.s,
    },
    message: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        marginBottom: SPACING.l,
    },
    button: {
        backgroundColor: PALETTE.yellowLight,
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
