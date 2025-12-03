
import { GlassView } from '@/components/ui/GlassView';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface CheckInSuccessProps {
    visible: boolean;
    onClose: () => void;
    participantName: string;
    location: string;
}

export function CheckInSuccess({ visible, onClose, participantName, location }: CheckInSuccessProps) {
    const scale = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = withSpring(1, { damping: 12 });
            // Auto close after 3 seconds
            const timer = setTimeout(() => {
                onClose();
                scale.value = 0;
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            scale.value = 0;
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Animated.View style={[styles.contentContainer, animatedStyle]}>
                    <GlassView style={styles.glass} intensity={30}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="checkmark-circle" size={64} color={Colors.dark.success} />
                        </View>

                        <ThemedText variant="h2" style={styles.title}>CHECKED IN!</ThemedText>

                        <ThemedText style={styles.name}>{participantName}</ThemedText>

                        <View style={styles.locationContainer}>
                            <ThemedText variant="caption" style={styles.label}>ASSIGNED LOCATION</ThemedText>
                            <ThemedText variant="h3" style={styles.location}>{location}</ThemedText>
                        </View>
                    </GlassView>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    contentContainer: {
        width: '100%',
        maxWidth: 340,
    },
    glass: {
        borderRadius: 24,
        padding: Spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.success,
    },
    iconContainer: {
        marginBottom: Spacing.m,
        shadowColor: Colors.dark.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    title: {
        color: Colors.dark.success,
        marginBottom: Spacing.s,
        letterSpacing: 2,
    },
    name: {
        fontSize: 18,
        marginBottom: Spacing.l,
        textAlign: 'center',
    },
    locationContainer: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: Spacing.m,
        borderRadius: 12,
        alignItems: 'center',
    },
    label: {
        color: '#888',
        marginBottom: 4,
    },
    location: {
        color: '#FFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: Spacing.m,
    },
    button: {
        width: '100%',
    }
});
