import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useAuthStore } from '../../context/authStore';
import { Popup } from '../../components/Popup';

import { useRouter } from 'expo-router';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuthStore();
    const insets = useSafeAreaInsets();

    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Popup State
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState<'success' | 'error' | 'info'>('info');

    const showPopup = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupType(type);
        setPopupVisible(true);
    };

    const hidePopup = () => {
        setPopupVisible(false);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter both email and password'
            });
            return;
        }

        try {
            await login(email, password);
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'Welcome back!'
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message || 'An error occurred'
            });
        }
    };

    return (
        <View
            style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Tekron ~ NST</Text>
                            <Text style={styles.subtitle}>The Ultimate Tech Showdown</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={[styles.inputContainer, emailFocused && styles.inputContainerFocused]}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={emailFocused ? PALETTE.primaryBlue : PALETTE.mediumGray}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Codename (Email)"
                                    placeholderTextColor={PALETTE.mediumGray}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                />
                            </View>

                            <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={passwordFocused ? PALETTE.primaryBlue : PALETTE.mediumGray}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Secret Key (Password)"
                                    placeholderTextColor={PALETTE.mediumGray}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={PALETTE.mediumGray}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={handleLogin}
                                activeOpacity={0.8}
                                disabled={isLoading}
                                style={styles.buttonWrapper}
                            >
                                <View style={styles.button}>
                                    {isLoading ? (
                                        <ActivityIndicator color={PALETTE.white} />
                                    ) : (
                                        <Text style={styles.buttonText}>Jack In</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Popup
                visible={popupVisible}
                title={popupTitle}
                message={popupMessage}
                onClose={hidePopup}
                type={popupType}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgSuperLight,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.l,
    },
    card: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.l,
        padding: SPACING.xl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.primaryBlue,
        fontSize: 32,
        marginBottom: SPACING.xs,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    formContainer: {
        gap: SPACING.m,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.bgSuperLight,
        borderRadius: RADIUS.m,
        paddingHorizontal: SPACING.m,
        height: 56,
        borderWidth: 1.5,
        borderColor: PALETTE.lightGray,
    },
    inputContainerFocused: {
        borderColor: PALETTE.primaryBlue,
        backgroundColor: PALETTE.white,
    },
    inputIcon: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        color: PALETTE.darkGray,
        height: '100%',
        fontSize: 16,
    },
    buttonWrapper: {
        marginTop: SPACING.s,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    button: {
        height: 56,
        borderRadius: RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.primaryBlue,
    },
    buttonText: {
        color: PALETTE.white,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    linkButton: {
        marginTop: SPACING.m,
        alignItems: 'center',
    },
    linkText: {
        color: PALETTE.darkGray,
        fontSize: 14,
    },
    linkHighlight: {
        color: PALETTE.primaryBlue,
        fontWeight: 'bold',
    },
});
