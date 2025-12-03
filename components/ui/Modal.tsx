import { Colors, Layout, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal as RNModal, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ThemedText } from './Typography';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View
                    style={[
                        styles.content,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            ...Layout.shadow.large,
                        },
                    ]}
                >
                    <View style={[styles.header, { borderBottomColor: colors.border }]}>
                        <ThemedText variant="h3">{title}</ThemedText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.body}>{children}</View>
                </View>
            </View>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.l,
    },
    content: {
        width: '100%',
        borderWidth: 2,
        borderRadius: Layout.radius.s,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.m,
        borderBottomWidth: 1,
    },
    body: {
        padding: Spacing.m,
    },
});
