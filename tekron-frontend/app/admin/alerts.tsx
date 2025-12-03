import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { GradientButton } from '../../components/GradientButton';
import { Loader } from '../../components/Loader';
import { Popup } from '../../components/Popup';
import { useAdminStore } from '../../context/adminStore';

export default function SendAlert() {
    const router = useRouter();
    const { sendAlert, isLoading } = useAdminStore();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSend = async () => {
        if (!title || !message) {
            // Show error popup or alert
            return;
        }
        await sendAlert(title, message);
        setShowSuccess(true);
    };

    const handleClosePopup = () => {
        setShowSuccess(false);
        router.back();
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Send Alert" showBack />
            <Loader visible={isLoading} />

            <Popup
                visible={showSuccess}
                title="Alert Sent"
                message="Your announcement has been broadcasted successfully."
                onClose={handleClosePopup}
                type="success"
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.label}>Alert Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Session Starting Soon"
                        placeholderTextColor={PALETTE.purpleMedium}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Type your announcement here..."
                        placeholderTextColor={PALETTE.purpleMedium}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>Note:</Text>
                        <Text style={styles.warningText}>
                            This alert will be sent to all approved participants immediately.
                        </Text>
                    </View>

                    <GradientButton
                        title="Send Alert"
                        onPress={handleSend}
                        style={styles.button}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.navyDark,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        padding: SPACING.l,
    },
    label: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        marginBottom: SPACING.s,
        fontWeight: '600',
    },
    input: {
        backgroundColor: PALETTE.purpleDeep,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        color: PALETTE.creamLight,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    textArea: {
        height: 120,
    },
    warningBox: {
        backgroundColor: 'rgba(247, 232, 164, 0.1)', // Yellow with opacity
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        marginBottom: SPACING.xl,
        borderLeftWidth: 4,
        borderLeftColor: PALETTE.yellowLight,
    },
    warningTitle: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.yellowLight,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    warningText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.creamLight,
    },
    button: {
        marginTop: SPACING.s,
    },
});
