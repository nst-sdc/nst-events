import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, GRADIENTS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useAuthStore } from '../../context/authStore';
import { Popup } from '../../components/Popup';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuthStore();
    const insets = useSafeAreaInsets();

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
        <LinearGradient
            colors={[PALETTE.purpleDeep, PALETTE.purpleDark]}
            style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Tekron @ NST</Text>
                        <Text style={styles.subtitle}>The Ultimate Tech Showdown</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={PALETTE.purpleLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Codename (Email)"
                                placeholderTextColor={PALETTE.purpleLight}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={PALETTE.purpleLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Secret Key (Password)"
                                placeholderTextColor={PALETTE.purpleLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={PALETTE.purpleLight}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} disabled={isLoading}>
                            <LinearGradient
                                colors={GRADIENTS.secondary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={PALETTE.creamLight} />
                                ) : (
                                    <Text style={styles.buttonText}>Jack In</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
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
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.l,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: PALETTE.creamLight,
        fontSize: 40,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        color: PALETTE.pinkLight,
        letterSpacing: 1,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: RADIUS.l,
        padding: SPACING.l,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: RADIUS.m,
        marginBottom: SPACING.m,
        paddingHorizontal: SPACING.m,
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    inputIcon: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        color: PALETTE.creamLight,
        height: '100%',
    },
    button: {
        height: 50,
        borderRadius: RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.s,
        shadowColor: PALETTE.pinkDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: PALETTE.creamLight,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
